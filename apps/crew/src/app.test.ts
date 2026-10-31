import { AppError } from '@/errors/app-error'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { App, type CreateRunInput } from '@/app'
import type { AgentRun } from '@/database/models/agent-runs-model'
import type { AgentRunsRepository } from '@/database/repositories/agent-runs-repository'

const UNFINISHED = ['started', 'running', 'stopping']
const outputSchema = z.object({ summary: z.string() })

function createFakeRepository() {
  const rows = new Map<string, AgentRun>()
  let sequence = 0
  let finishApplies = true

  const repository = {
    add: vi.fn(async (run) => {
      const isTaken = [...rows.values()].some(
        (row) => row.agent === run.agent && row.idempotencyKey === run.idempotencyKey,
      )

      if (isTaken) {
        throw new AppError('taken', 'taken', { code: 'idempotency_key_taken' })
      }

      sequence += 1
      const row: AgentRun = {
        id: `00000000-0000-4000-8000-${String(sequence).padStart(12, '0')}`,
        agent: run.agent,
        idempotencyKey: run.idempotencyKey,
        inputHash: run.inputHash,
        status: 'started',
        heartbeatAt: new Date(),
        subjectKey: run.subjectKey ?? null,
        subjectRevision: run.subjectRevision ?? null,
        input: run.input,
        output: null,
        errorCode: null,
        errorMessage: null,
        createdAt: new Date(),
        startedAt: null,
        finishedAt: null,
      }
      rows.set(row.id, row)

      return { ...row }
    }),
    findById: vi.fn(async (agent, id) => {
      const row = rows.get(id)
      return row && row.agent === agent ? { ...row } : null
    }),
    findByIdempotencyKey: vi.fn(async (agent, key) => {
      const row = [...rows.values()].find(
        (candidate) => candidate.agent === agent && candidate.idempotencyKey === key,
      )
      return row ? { ...row } : null
    }),
    findLatestCompleteReview: vi.fn(async () => null),
    finish: vi.fn(async (run) => {
      const row = rows.get(run.id)

      if (!finishApplies || !row || !UNFINISHED.includes(row.status)) return false

      row.status = run.status
      row.finishedAt = new Date()
      if (run.status === 'completed') row.output = run.output
      if (run.status === 'failed') {
        row.errorCode = run.errorCode
        row.errorMessage = run.errorMessage
      }

      return true
    }),
    markRunning: vi.fn(async (id) => {
      const row = rows.get(id)
      if (row?.status === 'started') row.status = 'running'
    }),
    markStopping: vi.fn(async (ids) => {
      for (const id of ids) {
        const row = rows.get(id)
        if (row && ['started', 'running'].includes(row.status)) row.status = 'stopping'
      }
    }),
    touchHeartbeats: vi.fn(async () => {}),
    failStale: vi.fn(async () => 0),
    removeFinishedBefore: vi.fn(async () => 0),
  } satisfies AgentRunsRepository

  return {
    repository,
    rows,
    rejectFinishWrites() {
      finishApplies = false
    },
    markAsInterrupted(id: string) {
      const row = rows.get(id)
      if (row) {
        row.status = 'failed'
        row.errorCode = 'interrupted'
        row.finishedAt = new Date()
      }
    },
  }
}

function createDeferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

function buildRequest(overrides: Partial<CreateRunInput> = {}): CreateRunInput {
  return {
    agent: 'pr-reviewer',
    workflowId: 'pr-review',
    idempotencyKey: 'key-1',
    input: { repository: 'JohnPetros/stardust', pull_number: 7 },
    subject: { key: 'JohnPetros/stardust#7', revision: 'a'.repeat(40) },
    outputSchema,
    ...overrides,
  }
}

const SILENT_LOGGER = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }

describe('App', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('creates a run and starts it in the background', async () => {
    const { repository, rows } = createFakeRepository()
    const deferred = createDeferred<unknown>()
    const runWorkflow = vi.fn(() => deferred.promise)
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow,
      logger: SILENT_LOGGER,
    })

    const run = await app.createRun(buildRequest())

    expect(run.status).toBe('started')
    expect(run.subjectKey).toBe('JohnPetros/stardust#7')
    expect(run.subjectRevision).toBe('a'.repeat(40))

    await vi.waitFor(() => expect(rows.get(run.id)?.status).toBe('running'))
    expect(runWorkflow).toHaveBeenCalledWith(
      'pr-review',
      { repository: 'JohnPetros/stardust', pull_number: 7 },
      { abortSignal: expect.any(AbortSignal) },
    )

    deferred.resolve({ summary: 'ok', ignored: true })

    await vi.waitFor(() => expect(rows.get(run.id)?.status).toBe('completed'))
    expect(rows.get(run.id)?.output).toEqual({ summary: 'ok' })
    expect(rows.get(run.id)?.finishedAt).toBeInstanceOf(Date)
  })

  it('does not overwrite a run recovered by another process', async () => {
    const fake = createFakeRepository()
    const deferred = createDeferred<unknown>()
    const app = new App({
      agentRunsRepository: fake.repository,
      runWorkflow: () => deferred.promise,
      logger: SILENT_LOGGER,
      maxConcurrentRunsPerAgent: 1,
    })

    const run = await app.createRun(buildRequest())
    await vi.waitFor(() => expect(fake.rows.get(run.id)?.status).toBe('running'))

    fake.markAsInterrupted(run.id)
    deferred.resolve({ summary: 'late' })

    await vi.waitFor(() => expect(fake.repository.finish).toHaveBeenCalled())
    await vi.waitFor(() => expect(fake.rows.get(run.id)?.errorCode).toBe('interrupted'))
    expect(fake.rows.get(run.id)?.status).toBe('failed')
    expect(fake.rows.get(run.id)?.output).toBeNull()

    await expect(
      app.createRun(buildRequest({ idempotencyKey: 'key-2' })),
    ).resolves.toMatchObject({ status: 'started' })
  })

  it('returns the existing run for a repeated key', async () => {
    const { repository } = createFakeRepository()
    const runWorkflow = vi.fn(() => new Promise<unknown>(() => {}))
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow,
      logger: SILENT_LOGGER,
    })

    const first = await app.createRun(buildRequest())
    const second = await app.createRun(
      buildRequest({ input: { pull_number: 7, repository: 'JohnPetros/stardust' } }),
    )

    expect(second.id).toBe(first.id)
    await vi.waitFor(() => expect(runWorkflow).toHaveBeenCalledTimes(1))
    expect(repository.add).toHaveBeenCalledTimes(1)
  })

  it('rejects a repeated key with a different input', async () => {
    const { repository } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    await app.createRun(buildRequest())

    await expect(
      app.createRun(
        buildRequest({ input: { repository: 'JohnPetros/stardust', pull_number: 8 } }),
      ),
    ).rejects.toMatchObject({ details: { code: 'idempotency_conflict' } })
  })

  it('rejects a fourth concurrent run', async () => {
    const { repository, rows } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    for (const key of ['key-1', 'key-2', 'key-3']) {
      await app.createRun(buildRequest({ idempotencyKey: key }))
    }

    await expect(
      app.createRun(buildRequest({ idempotencyKey: 'key-4' })),
    ).rejects.toMatchObject({ details: { code: 'too_many_runs' } })
    expect(rows.size).toBe(3)
  })

  it('replays an existing key even at the limit', async () => {
    const { repository } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })
    const created: AgentRun[] = []

    for (const key of ['key-1', 'key-2', 'key-3']) {
      created.push(await app.createRun(buildRequest({ idempotencyKey: key })))
    }

    const replayed = await app.createRun(buildRequest({ idempotencyKey: 'key-2' }))

    expect(replayed.id).toBe(created[1].id)
  })

  it('refreshes heartbeats while runs are in flight', async () => {
    vi.useFakeTimers()
    const { repository } = createFakeRepository()
    const deferred = createDeferred<unknown>()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => deferred.promise,
      logger: SILENT_LOGGER,
    })

    app.startMaintenance()
    const run = await app.createRun(buildRequest())

    await vi.advanceTimersByTimeAsync(15_000)
    expect(repository.touchHeartbeats).toHaveBeenCalledTimes(1)
    expect(repository.touchHeartbeats).toHaveBeenLastCalledWith([run.id])

    await vi.advanceTimersByTimeAsync(15_000)
    expect(repository.touchHeartbeats).toHaveBeenCalledTimes(2)

    deferred.resolve({ summary: 'ok' })
    await vi.advanceTimersByTimeAsync(0)
    const callsAfterRun = repository.touchHeartbeats.mock.calls.length

    await vi.advanceTimersByTimeAsync(30_000)
    expect(repository.touchHeartbeats).toHaveBeenCalledTimes(callsAfterRun)
    await app.shutdown({ graceMs: 0 })
  })

  it('fails a run after the timeout', async () => {
    const { repository, rows } = createFakeRepository()
    let receivedSignal: AbortSignal | undefined
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: (_workflowId, _input, { abortSignal }) => {
        receivedSignal = abortSignal
        return new Promise<unknown>(() => {})
      },
      logger: SILENT_LOGGER,
      runTimeoutMs: 20,
    })

    const run = await app.createRun(buildRequest())

    await vi.waitFor(() => expect(rows.get(run.id)?.status).toBe('failed'))
    expect(receivedSignal?.aborted).toBe(true)
    expect(rows.get(run.id)?.errorCode).toBe('timeout')
    expect(rows.get(run.id)?.output).toBeNull()
  })

  it('fails a run with timeout when marking it as running outlasts the limit', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const marking = createDeferred<void>()
    repository.markRunning.mockImplementationOnce(() => marking.promise)
    const runWorkflow = vi.fn(() => new Promise<unknown>(() => {}))
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow,
      logger: SILENT_LOGGER,
      runTimeoutMs: 1_000,
    })
    const run = await app.createRun(buildRequest())

    await vi.advanceTimersByTimeAsync(1_000)

    expect(rows.get(run.id)?.status).toBe('failed')
    expect(rows.get(run.id)?.errorCode).toBe('timeout')
    expect(rows.get(run.id)?.output).toBeNull()

    marking.resolve()
    await vi.advanceTimersByTimeAsync(0)

    expect(runWorkflow).not.toHaveBeenCalled()
    expect(rows.get(run.id)?.status).toBe('failed')
    expect(rows.get(run.id)?.errorCode).toBe('timeout')
  })

  it('does not start the workflow when the deadline passed while marking the run', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const runWorkflow = vi.fn(() => new Promise<unknown>(() => {}))
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow,
      logger: SILENT_LOGGER,
      runTimeoutMs: 1_000,
    })
    repository.markRunning.mockImplementationOnce(async () => {
      await vi.advanceTimersByTimeAsync(1_000)
    })
    const run = await app.createRun(buildRequest())

    await vi.advanceTimersByTimeAsync(0)

    expect(runWorkflow).not.toHaveBeenCalled()
    expect(rows.get(run.id)?.status).toBe('failed')
    expect(rows.get(run.id)?.errorCode).toBe('timeout')
  })

  it('fails a run with invalid output', async () => {
    const { repository, rows } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: async () => ({ summary: 42 }),
      logger: SILENT_LOGGER,
    })

    const run = await app.createRun(buildRequest())

    await vi.waitFor(() => expect(rows.get(run.id)?.status).toBe('failed'))
    expect(rows.get(run.id)?.errorCode).toBe('invalid_output')
    expect(rows.get(run.id)?.output).toBeNull()
  })

  it('maps a workflow error code', async () => {
    const { repository, rows } = createFakeRepository()
    const failures = [
      ['reviewer_failed', new AppError('boom', 'boom', { code: 'reviewer_failed' })],
      ['workflow_failed', new Error('connection string postgres://secret')],
    ] as const

    for (const [index, [expectedCode, error]] of failures.entries()) {
      const app = new App({
        agentRunsRepository: repository,
        runWorkflow: async () => {
          throw error
        },
        logger: SILENT_LOGGER,
      })

      const run = await app.createRun(buildRequest({ idempotencyKey: `key-${index}` }))

      await vi.waitFor(() => expect(rows.get(run.id)?.status).toBe('failed'))
      expect(rows.get(run.id)?.errorCode).toBe(expectedCode)
      expect(rows.get(run.id)?.errorMessage).not.toContain('secret')
    }
  })

  it('fails only stale unfinished runs on recovery', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-28T12:00:00.000Z'))
    const { repository } = createFakeRepository()
    repository.failStale.mockResolvedValue(2)
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    await expect(app.recoverInterruptedRuns()).resolves.toBe(2)
    expect(repository.failStale).toHaveBeenLastCalledWith(
      new Date('2026-10-28T11:59:00.000Z'),
      'interrupted',
      expect.any(String),
    )

    app.startMaintenance()
    await vi.advanceTimersByTimeAsync(60_000)

    expect(repository.failStale).toHaveBeenCalledTimes(2)
    expect(repository.failStale).toHaveBeenLastCalledWith(
      new Date('2026-10-28T12:00:00.000Z'),
      'interrupted',
      expect.any(String),
    )
    await app.shutdown({ graceMs: 0 })
  })

  it('purges old runs but keeps the last completed run per subject', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-28T12:00:00.000Z'))
    const { repository } = createFakeRepository()
    repository.removeFinishedBefore.mockResolvedValue(5)
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    await expect(app.purgeOldRuns()).resolves.toBe(5)
    expect(repository.removeFinishedBefore).toHaveBeenCalledExactlyOnceWith(
      new Date('2026-09-28T12:00:00.000Z'),
    )
  })

  it('keeps draining when marking runs as stopping fails', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    repository.markStopping.mockRejectedValue(
      new Error('connection refused to postgres://user:secret@db/crew'),
    )
    const deferred = createDeferred<unknown>()
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => deferred.promise,
      logger,
    })
    const run = await app.createRun(buildRequest())
    await vi.advanceTimersByTimeAsync(0)

    let hasDrained = false
    const shutdown = app.shutdown({ graceMs: 300_000 }).then(() => {
      hasDrained = true
    })
    await vi.advanceTimersByTimeAsync(0)

    expect(hasDrained).toBe(false)
    expect(logger.warn).toHaveBeenCalledTimes(1)
    expect(logger.warn.mock.calls.flat().join('\n')).not.toContain('secret')

    deferred.resolve({ summary: 'ok' })
    await shutdown

    expect(rows.get(run.id)?.status).toBe('completed')
  })

  it('returns the winner when the insert loses the race on the idempotency key', async () => {
    const fake = createFakeRepository()
    const app = new App({
      agentRunsRepository: fake.repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })
    const winner = await app.createRun(buildRequest())
    fake.repository.add.mockClear()

    fake.repository.findByIdempotencyKey.mockResolvedValueOnce(null)
    const sameInput = await app.createRun(buildRequest())

    expect(sameInput.id).toBe(winner.id)
    expect(fake.repository.add).toHaveBeenCalledTimes(1)

    fake.repository.findByIdempotencyKey.mockResolvedValueOnce(null)
    await expect(
      app.createRun(
        buildRequest({ input: { repository: 'JohnPetros/stardust', pull_number: 9 } }),
      ),
    ).rejects.toMatchObject({ details: { code: 'idempotency_conflict' } })

    await app.createRun(buildRequest({ idempotencyKey: 'key-2' }))
    await expect(
      app.createRun(buildRequest({ idempotencyKey: 'key-3' })),
    ).resolves.toMatchObject({ status: 'started' })
  })

  it('hashes equal inputs equally regardless of key order, nested or not', async () => {
    const { repository } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    const first = await app.createRun(
      buildRequest({ input: { b: { y: 1, x: [{ d: 1, c: 2 }] }, a: 'é', 10: 1, 2: 2 } }),
    )
    const second = await app.createRun(
      buildRequest({ input: { 2: 2, 10: 1, a: 'é', b: { x: [{ c: 2, d: 1 }], y: 1 } } }),
    )

    expect(second.id).toBe(first.id)
  })

  it('refuses runs and drains on shutdown', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const deferred = createDeferred<unknown>()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => deferred.promise,
      logger: SILENT_LOGGER,
    })
    const run = await app.createRun(buildRequest())
    await vi.advanceTimersByTimeAsync(0)

    let hasDrained = false
    const shutdown = app.shutdown({ graceMs: 300_000 }).then(() => {
      hasDrained = true
    })
    await vi.advanceTimersByTimeAsync(0)

    await expect(
      app.createRun(buildRequest({ idempotencyKey: 'key-2' })),
    ).rejects.toMatchObject({ details: { code: 'shutting_down' } })
    expect(repository.markStopping).toHaveBeenCalledWith([run.id])
    expect(rows.get(run.id)?.status).toBe('stopping')
    expect(hasDrained).toBe(false)

    deferred.resolve({ summary: 'ok' })
    await shutdown

    expect(rows.get(run.id)?.status).toBe('completed')
  })

  it('stops waiting for in-flight runs after the grace period', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })
    const run = await app.createRun(buildRequest())
    await vi.advanceTimersByTimeAsync(0)

    let hasDrained = false
    const shutdown = app.shutdown({ graceMs: 300_000 }).then(() => {
      hasDrained = true
    })

    await vi.advanceTimersByTimeAsync(299_000)
    expect(hasDrained).toBe(false)

    await vi.advanceTimersByTimeAsync(1_000)
    await shutdown

    expect(rows.get(run.id)?.status).toBe('stopping')
  })

  it('stops shutting down at the grace deadline when marking runs as stopping never settles', async () => {
    vi.useFakeTimers()
    const { repository } = createFakeRepository()
    repository.markStopping.mockImplementation(() => new Promise<void>(() => {}))
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })
    app.startMaintenance()
    await app.createRun(buildRequest())
    await vi.advanceTimersByTimeAsync(0)

    let hasShutDown = false
    const shutdown = app.shutdown({ graceMs: 5_000 }).then(() => {
      hasShutDown = true
    })

    await vi.advanceTimersByTimeAsync(4_999)
    expect(hasShutDown).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    await shutdown
    expect(hasShutDown).toBe(true)

    const heartbeatCalls = repository.touchHeartbeats.mock.calls.length
    await vi.advanceTimersByTimeAsync(30_000)
    expect(repository.touchHeartbeats).toHaveBeenCalledTimes(heartbeatCalls)
  })

  it('tracks a run whose insert resolves after shutdown began', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const insertion = createDeferred<void>()
    const insert = repository.add.getMockImplementation()
    repository.add.mockImplementationOnce(async (run) => {
      await insertion.promise
      return insert?.(run) as Promise<AgentRun>
    })
    const workflow = createDeferred<unknown>()
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => workflow.promise,
      logger: SILENT_LOGGER,
    })

    const admission = app.createRun(buildRequest())
    await vi.advanceTimersByTimeAsync(0)

    let hasDrained = false
    const shutdown = app.shutdown({ graceMs: 300_000 }).then(() => {
      hasDrained = true
    })
    await vi.advanceTimersByTimeAsync(0)

    insertion.resolve()
    const run = await admission
    await vi.advanceTimersByTimeAsync(0)

    expect(repository.markStopping).toHaveBeenCalledWith([run.id])
    expect(rows.get(run.id)?.status).toBe('stopping')
    expect(hasDrained).toBe(false)

    workflow.resolve({ summary: 'ok' })
    await shutdown

    expect(rows.get(run.id)?.status).toBe('completed')
  })

  it('rejects a request that reaches the insert step after shutdown began', async () => {
    vi.useFakeTimers()
    const { repository, rows } = createFakeRepository()
    const lookup = createDeferred<null>()
    repository.findByIdempotencyKey.mockImplementationOnce(() => lookup.promise)
    const app = new App({
      agentRunsRepository: repository,
      runWorkflow: () => new Promise<unknown>(() => {}),
      logger: SILENT_LOGGER,
    })

    const admission = app.createRun(buildRequest())
    const rejection = expect(admission).rejects.toMatchObject({
      details: { code: 'shutting_down' },
    })
    await vi.advanceTimersByTimeAsync(0)

    const shutdown = app.shutdown({ graceMs: 300_000 })
    lookup.resolve(null)

    await rejection
    await shutdown

    expect(repository.add).not.toHaveBeenCalled()
    expect(rows.size).toBe(0)
  })
})

// Startup configuration is a boundary: product environment values must not be reused.
describe('Crew startup configuration', () => {
  it('requires its own database URL even when the product database is configured', async () => {
    const { parseEnv } = await import('@/env')
    const source = { ...process.env, CREW_DATABASE_URL: undefined }

    expect(() => parseEnv({ ...source, DATABASE_URL: 'postgres://product/db' })).toThrow(
      /CREW_DATABASE_URL/,
    )
  })

  it('requires Anthropic credentials and never substitutes an OpenRouter key', async () => {
    const { parseEnv } = await import('@/env')
    const source = { ...process.env, ANTHROPIC_API_KEY: undefined }

    expect(() =>
      parseEnv({ ...source, OPENROUTER_API_KEY: 'test-provider-key' }),
    ).toThrow(/ANTHROPIC_API_KEY/)
  })

  it('reports invalid variable names without exposing their values', async () => {
    const { parseEnv } = await import('@/env')
    const source = { ...process.env, PR_REVIEWER_API_KEY: 'private-invalid-value' }

    try {
      parseEnv(source)
      expect.fail('Startup should reject a short API key')
    } catch (error) {
      expect(error).toBeInstanceOf(AppError)
      expect((error as AppError).message).toContain('PR_REVIEWER_API_KEY')
      expect((error as AppError).message).not.toContain('private-invalid-value')
    }
  })
})
