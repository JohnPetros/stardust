import { randomUUID } from 'node:crypto'
import type {
  Amqp,
  Broker,
  Job,
  OutboxRepository,
} from '@stardust/core/global/interfaces'
import { Integer, Text } from '@stardust/core/global/structures'
import type { OutboxEvent } from '@stardust/core/global/types'

export class DispatchOutboxEventsJob implements Job {
  private lastCleanupAt?: number

  constructor(
    private readonly repository: OutboxRepository,
    private readonly publisher: Broker,
    private readonly clock: () => Date = () => new Date(),
    private readonly owner: Text = Text.create(randomUUID()),
    private readonly onTerminalFailure: (id: string, attempts: number) => void = () => {
      console.error('Outbox event reached delivery attempt limit')
    },
  ) {}

  async handle(amqp: Amqp): Promise<void> {
    await amqp.run(async () => {
      const now = this.clock()
      await this.repository.recover(now)
      const events = await this.repository.reserve(now, this.owner, Integer.create(100))
      for (const event of events) await this.dispatch(event)
      await this.cleanup(now)
    }, 'Dispatch outbox events')
  }

  private async dispatch(event: OutboxEvent): Promise<void> {
    try {
      await this.publish(event)
    } catch {
      await this.recordFailure(event)
      return
    }
    await this.acknowledge(event)
  }

  private acknowledge(event: OutboxEvent): Promise<boolean> {
    return this.repository.markPublished(Text.create(event.id), this.owner, this.clock())
  }

  private publish(event: OutboxEvent): Promise<void> {
    return this.publisher.publish(
      { name: event.name, payload: event.payload },
      Text.create(event.id),
    )
  }

  private async recordFailure(event: OutboxEvent): Promise<void> {
    const attempts = event.attempts + 1
    const recorded = await this.markFailed(event.id, attempts, this.clock())
    if (recorded && attempts >= 10) this.onTerminalFailure(event.id, attempts)
  }

  private markFailed(id: string, attempts: number, now: Date): Promise<boolean> {
    return this.repository.markFailed(
      Text.create(id),
      this.owner,
      Integer.create(attempts),
      this.nextAttemptAt(now, attempts),
      now,
    )
  }

  private nextAttemptAt(now: Date, attempts: number): Date {
    const delayMinutes = [1, 5, 15, 60][Math.min(attempts - 1, 3)]
    return new Date(now.getTime() + delayMinutes * 60_000)
  }

  private isCleanupDue(now: Date): boolean {
    return (
      this.lastCleanupAt === undefined || now.getTime() - this.lastCleanupAt >= 86_400_000
    )
  }

  private async cleanup(now: Date): Promise<void> {
    if (!this.isCleanupDue(now)) return
    await this.repository.cleanup(new Date(now.getTime() - 30 * 86_400_000))
    this.lastCleanupAt = now.getTime()
  }
}
