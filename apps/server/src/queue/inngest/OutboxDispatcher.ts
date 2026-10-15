import type { Amqp } from '@stardust/core/global/interfaces'

import type { DispatchOutboxEventsJob } from '../jobs/global/DispatchOutboxEventsJob'

export class OutboxDispatcher {
  private timer?: ReturnType<typeof setInterval>
  private running?: Promise<void>

  constructor(
    private readonly job: DispatchOutboxEventsJob,
    private readonly onError: () => void = () => {
      console.error('Outbox sweep failed')
    },
  ) {}

  start(): void {
    if (this.timer) return
    this.timer = setInterval(() => this.sweep(), 1000)
    this.timer.unref()
    this.sweep()
  }

  async stop(): Promise<void> {
    clearInterval(this.timer)
    this.timer = undefined
    await this.running
  }

  private sweep(): void {
    if (this.running) return
    this.running = this.job
      .handle(this.amqp)
      .catch(() => this.reportFailure())
      .finally(() => {
        this.running = undefined
      })
  }

  private reportFailure(): void {
    try {
      this.onError()
    } catch {
      // Observability cannot reject the background sweep promise.
    }
  }

  private readonly amqp: Amqp = {
    async run<Response>(operation: () => Promise<unknown>): Promise<Response> {
      return (await operation()) as Response
    },
    getPayload: () => undefined,
    sleepFor: async () => {
      throw new Error('Outbox dispatcher does not sleep inside jobs')
    },
    waitFor: async () => {
      throw new Error('Outbox dispatcher does not wait for events')
    },
  }
}
