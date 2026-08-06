import type { Event } from '#global/domain/abstracts/index'
import type { Text } from '#global/domain/structures/Text'

export interface Broker {
  publish(event: Event, eventId?: Text): Promise<void>
}
