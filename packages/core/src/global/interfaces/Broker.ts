import type { Event } from '#global/domain/abstracts/index'

export interface Broker {
  publish(event: Event): Promise<void>
}
