import type { Event } from '#global/domain/abstracts/index'

export interface EventBroker {
  publish(event: Event): Promise<void>
}
