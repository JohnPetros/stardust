import { sql } from 'drizzle-orm'
import type { Broker } from '@stardust/core/global/interfaces'
import { Integer, Text } from '@stardust/core/global/structures'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import { DrizzleOutboxRepository } from '@/database/drizzle/repositories/global/DrizzleOutboxRepository'
import { outboxEventModel } from '@/database/drizzle/models/global/outbox-event-model'
import { DispatchOutboxEventsJob } from '@/queue/jobs/global/DispatchOutboxEventsJob'
import { NoStepAmqp } from '@/queue/inngest/NoStepAmqp'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

// Exercise a registered job boundary with real PostgreSQL; only the transport is
// controlled so failures/crash windows can be observed without external effects.
describe('DispatchOutboxEventsJob persistence', () => {
  const fixture = new SupabaseFixture()
  const repository = new DrizzleOutboxRepository(fixture.database, { kind: 'system' })
  const amqp = new NoStepAmqp(undefined)
  const now = new Date('2030-01-01T00:00:00.000Z')
  const rows = () =>
    fixture.database.select().from(outboxEventModel).orderBy(outboxEventModel.sequence)
  const seed = (
    id: string,
    overrides: Partial<typeof outboxEventModel.$inferInsert> = {},
  ) =>
    fixture.database.insert(outboxEventModel).values({
      id,
      eventName: 'test.outbox.event',
      payload: { value: id },
      availableAt: now,
      ...overrides,
    })
  const job = (publish: Broker['publish'], owner = 'worker-a', clock = () => now) =>
    new DispatchOutboxEventsJob(
      repository,
      { publish },
      clock,
      Text.create(owner),
      () => undefined,
    )

  beforeEach(async () => {
    await fixture.clearDatabase()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })

  it('delivers a committed event with its stable ID and acknowledges it', async () => {
    await new DrizzleUnitOfWork(fixture.database).run(async () => {
      await new InngestBroker().publish(
        { name: 'test.outbox.event', payload: { value: 'saved' } },
        Text.create('stable-event'),
      )
    })
    const publish = jest.fn().mockResolvedValue(undefined)
    await job(publish).handle(amqp)
    expect(publish).toHaveBeenCalledWith(
      { name: 'test.outbox.event', payload: { value: 'saved' } },
      Text.create('stable-event'),
    )
    expect(await rows()).toEqual([
      expect.objectContaining({
        id: 'stable-event',
        status: 'published',
        attempts: 0,
        reservedBy: null,
        reservationExpiresAt: null,
      }),
    ])
  })

  it('retains failed delivery and retries only after its backoff', async () => {
    await seed('retry-event')
    const publish = jest
      .fn()
      .mockRejectedValueOnce(new Error('Controlled transport failure'))
      .mockResolvedValue(undefined)
    let clock = now
    const worker = job(publish, 'worker-a', () => clock)
    await worker.handle(amqp)
    expect(await rows()).toEqual([
      expect.objectContaining({
        id: 'retry-event',
        status: 'failed',
        attempts: 1,
        availableAt: new Date(now.getTime() + 60_000),
        lastErrorCode: 'delivery_failed',
      }),
    ])
    await worker.handle(amqp)
    expect(publish).toHaveBeenCalledTimes(1)
    clock = new Date(now.getTime() + 60_000)
    await worker.handle(amqp)
    expect(publish).toHaveBeenCalledTimes(2)
    expect(publish.mock.calls.map(([, id]) => id.value)).toEqual([
      'retry-event',
      'retry-event',
    ])
    expect(await rows()).toEqual([
      expect.objectContaining({ status: 'published', attempts: 1 }),
    ])
  })

  it('claims disjoint batches under concurrent workers and drains beyond 100 events', async () => {
    await fixture.database.insert(outboxEventModel).values(
      Array.from({ length: 150 }, (_, index) => ({
        id: `batch-${index}`,
        eventName: 'test.outbox.event',
        payload: { index },
        availableAt: now,
      })),
    )
    let release!: () => void
    let bothStarted!: () => void
    const released = new Promise<void>((resolve) => {
      release = resolve
    })
    const started = new Promise<void>((resolve) => {
      bothStarted = resolve
    })
    const ids: string[] = []
    const owners = new Set<string>()
    const worker = (owner: string) =>
      job(async (_event, id) => {
        owners.add(owner)
        if (!id) throw new Error('Expected durable event ID')
        ids.push(id.value)
        if (owners.size === 2) bothStarted()
        await released
      }, owner)
    const executions = [worker('worker-a').handle(amqp), worker('worker-b').handle(amqp)]
    try {
      await started
      const reserved = await rows()
      expect(reserved).toHaveLength(150)
      expect(reserved.every((event) => event.status === 'publishing')).toBe(true)
      expect(
        ['worker-a', 'worker-b']
          .map((owner) => reserved.filter((event) => event.reservedBy === owner).length)
          .sort((a, b) => a - b),
      ).toEqual([50, 100])
    } finally {
      release()
      await Promise.all(executions)
    }
    expect(ids).toHaveLength(150)
    expect(new Set(ids).size).toBe(150)
    expect((await rows()).every((event) => event.status === 'published')).toBe(true)
  })

  it('recovers an expired lease and rejects acknowledgment from the former owner', async () => {
    await seed('expired-event', {
      status: 'publishing',
      reservedBy: 'dead-worker',
      reservationExpiresAt: new Date(now.getTime() - 1),
    })
    await job(async () => undefined, 'live-worker').handle(amqp)
    expect(
      await repository.markPublished(
        Text.create('expired-event'),
        Text.create('dead-worker'),
        now,
      ),
    ).toBe(false)
    expect(
      await repository.markFailed(
        Text.create('expired-event'),
        Text.create('dead-worker'),
        Integer.create(1),
        now,
        now,
      ),
    ).toBe(false)
    expect(await rows()).toEqual([
      expect.objectContaining({
        id: 'expired-event',
        status: 'published',
        reservedBy: null,
      }),
    ])
  })

  it('keeps terminal failures and pending events while deleting only old published events', async () => {
    const old = new Date(now.getTime() - 31 * 86_400_000)
    await seed('terminal-event', { status: 'failed', attempts: 10, availableAt: old })
    await seed('old-published', { status: 'published', publishedAt: old })
    await seed('future-pending', { availableAt: new Date(now.getTime() + 60_000) })
    const publish = jest.fn().mockResolvedValue(undefined)
    await job(publish).handle(amqp)
    expect(publish).not.toHaveBeenCalled()
    expect((await rows()).map((event) => event.id)).toEqual([
      'terminal-event',
      'future-pending',
    ])
  })

  it('rolls back the root even if a nested failure is caught and does not leak context', async () => {
    const database = new DrizzleUnitOfWork(fixture.database)
    await expect(
      database.run(async () => {
        await new InngestBroker().publish(
          { name: 'test.outbox.event', payload: {} },
          Text.create('outer-event'),
        )
        try {
          await database.run(async () => {
            await new InngestBroker().publish(
              { name: 'test.outbox.event', payload: {} },
              Text.create('inner-event'),
            )
            throw new Error('Controlled nested failure')
          })
        } catch {
          // Catching a nested error cannot turn the outer transaction into success.
        }
      }),
    ).rejects.toThrow()
    expect(await rows()).toEqual([])
    await new InngestBroker().publish(
      { name: 'test.outbox.event', payload: {} },
      Text.create('independent-event'),
    )
    expect((await rows()).map((event) => event.id)).toEqual(['independent-event'])
  })

  it('isolates simultaneous transaction contexts and preserves one independent commit', async () => {
    const database = new DrizzleUnitOfWork(fixture.database)
    const outcome = await Promise.allSettled([
      database.run(async () => {
        await new InngestBroker().publish(
          { name: 'test.outbox.event', payload: {} },
          Text.create('commit-event'),
        )
      }),
      database.run(async () => {
        await new InngestBroker().publish(
          { name: 'test.outbox.event', payload: {} },
          Text.create('rollback-event'),
        )
        throw new Error('Controlled rollback')
      }),
    ])
    expect(outcome.map((result) => result.status)).toEqual(['fulfilled', 'rejected'])
    expect((await rows()).map((event) => event.id)).toEqual(['commit-event'])
  })

  it.each(['anon', 'authenticated'])(
    'denies %s direct access to internal events and sequence',
    async (role) => {
      await expect(
        fixture.database.transaction(async (transaction) => {
          await transaction.execute(sql.raw(`SET LOCAL ROLE ${role}`))
          await transaction.select().from(outboxEventModel)
        }),
      ).rejects.toThrow()
      const [grants] = await fixture.database.execute(sql`SELECT
      has_table_privilege(${role}, 'public.outbox_events', 'SELECT') as can_read,
      has_table_privilege(${role}, 'public.outbox_events', 'INSERT') as can_write,
      has_sequence_privilege(${role}, 'public.outbox_events_sequence_seq', 'USAGE') as can_use_sequence`)
      expect(grants).toEqual(
        expect.objectContaining({
          can_read: false,
          can_write: false,
          can_use_sequence: false,
        }),
      )
    },
  )
})
