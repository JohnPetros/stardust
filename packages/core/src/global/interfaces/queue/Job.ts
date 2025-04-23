import type { Amqp } from './Amqp'

export interface Job<Payload = void> {
  eventName?: string
  handle(amqp?: Amqp<Payload>): Promise<void>
}
