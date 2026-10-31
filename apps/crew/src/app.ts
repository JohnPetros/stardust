import { createHash } from 'node:crypto'

import { AppError } from '@/errors/app-error'
import type { ZodType } from 'zod'

import type { AgentRun } from '@/database/models/agent-runs-model'
import type { AgentRunsRepository } from '@/database/repositories/agent-runs-repository'
import { describeError } from '@/utils/describe-error'

const DEFAULT_RUN_TIMEOUT_MS = 1_200_000
const DEFAULT_MAX_CONCURRENT_RUNS_PER_AGENT = 3
const DEFAULT_HEARTBEAT_INTERVAL_MS = 15_000
const DEFAULT_STALE_AFTER_MS = 60_000
const RECOVERY_INTERVAL_MS = 60_000
const RETENTION_MS = 30 * 24 * 60 * 60 * 1000
const DEFAULT_SHUTDOWN_GRACE_MS = 300_000

const RUN_FAILURES = {
  timeout: 'A revisão excedeu o tempo limite de 20 minutos.',
  invalid_output: 'A saída da revisão não passou na validação.',
  reviewer_failed: 'Um dos revisores falhou ao concluir a análise.',
  composio_tools_missing: 'As ferramentas de leitura do GitHub não estão disponíveis.',
  workflow_failed: 'O fluxo de revisão falhou.',
  interrupted: 'A revisão foi interrompida antes de terminar.',
} as const

type RunFailureCode = keyof typeof RUN_FAILURES

export type RunWorkflow = (
  workflowId: string,
  inputData: unknown,
  options: { abortSignal: AbortSignal },
) => Promise<unknown>

export type AppLogger = {
  info(message: string): void
  warn(message: string): void
  error(message: string): void
}

export type CreateRunInput = {
  agent: string
  workflowId: string
  idempotencyKey: string
  input: unknown
  subject?: { key: string; revision: string }
  outputSchema: ZodType
}

type AppDependencies = {
  agentRunsRepository: AgentRunsRepository
  runWorkflow: RunWorkflow
  logger?: AppLogger
  now?: () => Date
  runTimeoutMs?: number
  maxConcurrentRunsPerAgent?: number
  heartbeatIntervalMs?: number
  staleAfterMs?: number
}

type InFlightRun = {
  agent: string
  settled: Promise<void>
}

export class App {
  private readonly agentRunsRepository: AgentRunsRepository
  private readonly runWorkflow: RunWorkflow
  private readonly logger: AppLogger
  private readonly now: () => Date
  private readonly runTimeoutMs: number
  private readonly maxConcurrentRunsPerAgent: number
  private readonly heartbeatIntervalMs: number
  private readonly staleAfterMs: number
  private readonly inFlightRuns = new Map<string, InFlightRun>()
  private readonly activeRunsCountByAgent = new Map<string, number>()
  private readonly pendingAdmissions = new Set<Promise<AgentRun>>()
  private readonly maintenanceTimers: NodeJS.Timeout[] = []
  private isShuttingDown = false

  constructor({
    agentRunsRepository,
    runWorkflow,
    logger = console,
    now = () => new Date(),
    runTimeoutMs = DEFAULT_RUN_TIMEOUT_MS,
    maxConcurrentRunsPerAgent = DEFAULT_MAX_CONCURRENT_RUNS_PER_AGENT,
    heartbeatIntervalMs = DEFAULT_HEARTBEAT_INTERVAL_MS,
    staleAfterMs = DEFAULT_STALE_AFTER_MS,
  }: AppDependencies) {
    this.agentRunsRepository = agentRunsRepository
    this.runWorkflow = runWorkflow
    this.logger = logger
    this.now = now
    this.runTimeoutMs = runTimeoutMs
    this.maxConcurrentRunsPerAgent = maxConcurrentRunsPerAgent
    this.heartbeatIntervalMs = heartbeatIntervalMs
    this.staleAfterMs = staleAfterMs
  }

  async createRun(input: CreateRunInput): Promise<AgentRun> {
    this.rejectWhenShuttingDown()

    const admission = this.admitRun(input)
    this.pendingAdmissions.add(admission)

    try {
      return await admission
    } finally {
      this.pendingAdmissions.delete(admission)
    }
  }

  private async admitRun(input: CreateRunInput): Promise<AgentRun> {
    const inputHash = this.hashInput(input.input)
    const existingRun = await this.agentRunsRepository.findByIdempotencyKey(
      input.agent,
      input.idempotencyKey,
    )

    if (existingRun) return this.resolveExistingRun(existingRun, inputHash)

    this.rejectWhenShuttingDown()
    this.rejectWhenAtLimit(input.agent)

    return this.insertAndStartRun(input, inputHash)
  }

  private rejectWhenAtLimit(agent: string) {
    if ((this.activeRunsCountByAgent.get(agent) ?? 0) < this.maxConcurrentRunsPerAgent) {
      return
    }

    this.throwAppError(
      'too_many_runs',
      'Há execuções demais em andamento. Tente novamente em instantes.',
      'Limite de execuções',
    )
  }

  private async insertAndStartRun(
    input: CreateRunInput,
    inputHash: string,
  ): Promise<AgentRun> {
    this.changeActiveRunsCount(input.agent, 1)

    let run: AgentRun
    try {
      run = await this.agentRunsRepository.add({
        agent: input.agent,
        idempotencyKey: input.idempotencyKey,
        inputHash,
        subjectKey: input.subject?.key,
        subjectRevision: input.subject?.revision,
        input: input.input,
      })
    } catch (error) {
      this.changeActiveRunsCount(input.agent, -1)

      return this.resolveRacedRun(input, inputHash, error)
    }

    this.logStatus(run.id, 'started')
    this.startRun(run, input)

    return run
  }

  private async resolveRacedRun(
    input: CreateRunInput,
    inputHash: string,
    error: unknown,
  ): Promise<AgentRun> {
    if (this.getErrorCode(error) !== 'idempotency_key_taken') throw error

    const racedRun = await this.agentRunsRepository.findByIdempotencyKey(
      input.agent,
      input.idempotencyKey,
    )

    if (!racedRun) throw error

    return this.resolveExistingRun(racedRun, inputHash)
  }

  async getRun(agent: string, runId: string): Promise<AgentRun> {
    const run = await this.agentRunsRepository.findById(agent, runId)

    if (!run) {
      this.throwAppError(
        'run_not_found',
        'Execução não encontrada.',
        'Execução não encontrada',
      )
    }

    return run
  }

  async getLastReview({
    agent,
    subjectKey,
  }: {
    agent: string
    subjectKey: string
  }): Promise<AgentRun> {
    const run = await this.agentRunsRepository.findLatestCompleteReview(agent, subjectKey)

    if (!run) {
      this.throwAppError(
        'review_not_found',
        'Nenhuma revisão anterior.',
        'Revisão não encontrada',
      )
    }

    return run
  }

  async recoverInterruptedRuns(): Promise<number> {
    const count = await this.failStaleRuns()
    this.logger.info(`crew: recovered ${count} interrupted runs`)

    return count
  }

  startMaintenance(): void {
    this.maintenanceTimers.push(
      setInterval(() => void this.touchInFlightHeartbeats(), this.heartbeatIntervalMs),
      setInterval(() => void this.recoverQuietly(), RECOVERY_INTERVAL_MS),
    )

    for (const timer of this.maintenanceTimers) timer.unref()
  }

  async purgeOldRuns(): Promise<number> {
    return this.agentRunsRepository.removeFinishedBefore(
      new Date(this.now().getTime() - RETENTION_MS),
    )
  }

  async shutdown({
    graceMs = DEFAULT_SHUTDOWN_GRACE_MS,
  }: {
    graceMs?: number
  } = {}): Promise<void> {
    this.isShuttingDown = true
    this.logger.info('crew: shutting down')

    let graceTimer: NodeJS.Timeout | undefined
    const graceElapsed = new Promise<void>((resolve) => {
      graceTimer = setTimeout(resolve, graceMs)
    })

    try {
      await Promise.race([this.drainRuns(), graceElapsed])
    } finally {
      clearTimeout(graceTimer)
      this.clearMaintenanceTimers()
    }
  }

  private async drainRuns() {
    await Promise.allSettled([...this.pendingAdmissions])

    const runIds = [...this.inFlightRuns.keys()]
    const settledRuns = [...this.inFlightRuns.values()].map(
      (inFlightRun) => inFlightRun.settled,
    )

    if (runIds.length > 0) {
      try {
        await this.agentRunsRepository.markStopping(runIds)
        for (const runId of runIds) this.logStatus(runId, 'stopping')
      } catch (error) {
        this.logger.warn(`crew: could not mark runs as stopping: ${describeError(error)}`)
      }
    }

    await Promise.allSettled(settledRuns)
  }

  private rejectWhenShuttingDown() {
    if (!this.isShuttingDown) return

    this.throwAppError(
      'shutting_down',
      'O crew está encerrando e não aceita novas execuções.',
      'Serviço encerrando',
    )
  }

  private throwAppError(code: string, message: string, title: string): never {
    throw new AppError(message, title, { code })
  }

  private compareCodeUnits(first: string, second: string): number {
    if (first === second) return 0

    return first < second ? -1 : 1
  }

  private canonicalize(value: unknown): unknown {
    if (Array.isArray(value)) return value.map((item) => this.canonicalize(item))

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([first], [second]) => this.compareCodeUnits(first, second))
          .map(([key, nested]) => [key, this.canonicalize(nested)]),
      )
    }

    return value
  }

  private hashInput(input: unknown): string {
    return createHash('sha256')
      .update(JSON.stringify(this.canonicalize(input)))
      .digest('hex')
  }

  private changeActiveRunsCount(agent: string, delta: 1 | -1) {
    this.activeRunsCountByAgent.set(
      agent,
      (this.activeRunsCountByAgent.get(agent) ?? 0) + delta,
    )
  }

  private logStatus(runId: string, status: string, errorCode?: string) {
    const suffix = errorCode ? ` error_code=${errorCode}` : ''
    this.logger.info(`crew: run ${runId} ${status}${suffix}`)
  }

  private resolveExistingRun(existing: AgentRun, inputHash: string): AgentRun {
    if (existing.inputHash !== inputHash) {
      this.throwAppError(
        'idempotency_conflict',
        'A chave de idempotência já foi usada com outra entrada.',
        'Conflito de idempotência',
      )
    }

    return existing
  }

  private getErrorCode(error: unknown): string | undefined {
    const code = (error as { details?: { code?: unknown } } | null)?.details?.code

    return typeof code === 'string' ? code : undefined
  }

  private resolveFailureCode(error: unknown, signal: AbortSignal): RunFailureCode {
    if (signal.aborted) return 'timeout'

    const code = this.getErrorCode(error)

    if (code && code in RUN_FAILURES && code !== 'interrupted') {
      return code as RunFailureCode
    }

    return 'workflow_failed'
  }

  private waitForAbort(signal: AbortSignal): Promise<never> {
    return new Promise((_resolve, reject) => {
      if (signal.aborted) {
        reject(signal.reason)
        return
      }

      signal.addEventListener('abort', () => reject(signal.reason), { once: true })
    })
  }

  private async finishRun(
    run: AgentRun,
    outcome: Parameters<AgentRunsRepository['finish']>[0],
  ) {
    const isApplied = await this.agentRunsRepository.finish(outcome)

    if (!isApplied) {
      this.logger.warn(`crew: run ${run.id} was already finished by another process`)
      return
    }

    this.logStatus(
      run.id,
      outcome.status,
      outcome.status === 'failed' ? outcome.errorCode : undefined,
    )
  }

  private async executeRun(
    run: AgentRun,
    request: Pick<CreateRunInput, 'workflowId' | 'input' | 'outputSchema'>,
  ) {
    const controller = new AbortController()
    const timer = setTimeout(
      () =>
        controller.abort(
          new AppError(RUN_FAILURES.timeout, 'Tempo limite excedido', {
            code: 'timeout',
          }),
        ),
      this.runTimeoutMs,
    )

    const aborted = this.waitForAbort(controller.signal)

    try {
      await this.markRunningBeforeDeadline(run, controller.signal, aborted)

      const workflowRun = this.runWorkflow(request.workflowId, request.input, {
        abortSignal: controller.signal,
      })

      workflowRun.catch(() => {})

      await this.recordOutcome(
        run,
        request.outputSchema,
        await Promise.race([workflowRun, aborted]),
      )
    } catch (error) {
      await this.recordFailure(run, error, controller.signal)
    } finally {
      clearTimeout(timer)
    }
  }

  private async markRunningBeforeDeadline(
    run: AgentRun,
    signal: AbortSignal,
    aborted: Promise<never>,
  ) {
    const marking = this.agentRunsRepository.markRunning(run.id)
    marking.catch(() => {})
    await Promise.race([marking, aborted])

    if (signal.aborted) throw signal.reason

    this.logStatus(run.id, 'running')
  }

  private async recordOutcome(run: AgentRun, outputSchema: ZodType, result: unknown) {
    const parsed = outputSchema.safeParse(result)

    if (!parsed.success) {
      await this.finishRun(run, {
        id: run.id,
        status: 'failed',
        errorCode: 'invalid_output',
        errorMessage: RUN_FAILURES.invalid_output,
      })
      return
    }

    await this.finishRun(run, { id: run.id, status: 'completed', output: parsed.data })
  }

  private async recordFailure(run: AgentRun, error: unknown, signal: AbortSignal) {
    const errorCode = this.resolveFailureCode(error, signal)

    await this.finishRun(run, {
      id: run.id,
      status: 'failed',
      errorCode,
      errorMessage: RUN_FAILURES[errorCode],
    })
  }

  private startRun(
    run: AgentRun,
    request: Pick<CreateRunInput, 'workflowId' | 'input' | 'outputSchema'>,
  ) {
    const settled = this.executeRun(run, request)
      .catch((error: unknown) => {
        this.logger.error(
          `crew: run ${run.id} could not be recorded: ${describeError(error)}`,
        )
      })
      .finally(() => {
        this.inFlightRuns.delete(run.id)
        this.changeActiveRunsCount(run.agent, -1)
      })

    this.inFlightRuns.set(run.id, { agent: run.agent, settled })
  }

  private async failStaleRuns(): Promise<number> {
    const heartbeatBefore = new Date(this.now().getTime() - this.staleAfterMs)

    return this.agentRunsRepository.failStale(
      heartbeatBefore,
      'interrupted',
      RUN_FAILURES.interrupted,
    )
  }

  private async touchInFlightHeartbeats() {
    const runIds = [...this.inFlightRuns.keys()]

    if (runIds.length === 0) return

    try {
      await this.agentRunsRepository.touchHeartbeats(runIds)
    } catch (error) {
      this.logger.warn(`crew: heartbeat failed: ${describeError(error)}`)
    }
  }

  private async recoverQuietly() {
    try {
      const count = await this.failStaleRuns()
      if (count > 0) this.logger.info(`crew: recovered ${count} interrupted runs`)
    } catch (error) {
      this.logger.warn(`crew: recovery failed: ${describeError(error)}`)
    }
  }

  private clearMaintenanceTimers() {
    for (const timer of this.maintenanceTimers.splice(0)) clearInterval(timer)
  }
}
