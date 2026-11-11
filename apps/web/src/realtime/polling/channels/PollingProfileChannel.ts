import { UserCreatedEvent } from '@stardust/core/profile/events'
import type { ProfileChannel } from '@stardust/core/profile/interfaces'

import type { ProfileCreationPoll } from '../types'

type Params = {
  pollProfileCreation: () => Promise<ProfileCreationPoll>
  intervalInMs: number
  maxBackoffInMs: number
  timeoutInMs: number
}

type Listener = Parameters<ProfileChannel['onCreateUser']>[0]

class PollingSubscription {
  private isStopped = false
  private delayInMs: number
  private pollTimer: ReturnType<typeof setTimeout> | null = null
  private readonly deadline: number
  private readonly deadlineTimer: ReturnType<typeof setTimeout>

  constructor(
    private readonly params: Params,
    private readonly listener: Listener,
  ) {
    this.delayInMs = params.intervalInMs
    this.deadline = Date.now() + params.timeoutInMs
    this.deadlineTimer = setTimeout(this.stop, params.timeoutInMs)
    void this.poll()
  }

  readonly stop = () => {
    if (this.isStopped) return
    this.isStopped = true
    clearTimeout(this.deadlineTimer)
    if (this.pollTimer) clearTimeout(this.pollTimer)
    this.pollTimer = null
  }

  private readonly poll = async () => {
    this.pollTimer = null
    const result = await this.request()
    if (!this.isStopped) this.handle(result)
  }

  private async request(): Promise<ProfileCreationPoll> {
    try {
      return await this.params.pollProfileCreation()
    } catch {
      return { status: 'failed' }
    }
  }

  private handle(result: ProfileCreationPoll) {
    if (result.status === 'created') return this.deliver(result.payload)
    if (result.status === 'stopped') return this.stop()
    this.updateDelay(result)
    this.schedule()
  }

  private deliver(payload: UserCreatedEvent['payload']) {
    this.stop()
    this.listener(new UserCreatedEvent(payload))
  }

  private updateDelay(result: ProfileCreationPoll) {
    const { intervalInMs, maxBackoffInMs } = this.params
    this.delayInMs =
      result.status === 'pending'
        ? intervalInMs
        : Math.min(this.delayInMs * 2, maxBackoffInMs)
  }

  private schedule() {
    if (Date.now() + this.delayInMs >= this.deadline) return
    this.pollTimer = setTimeout(this.poll, this.delayInMs)
  }
}

export function PollingProfileChannel(params: Params): ProfileChannel {
  return {
    onCreateUser(listener) {
      return new PollingSubscription(params, listener).stop
    },
  }
}
