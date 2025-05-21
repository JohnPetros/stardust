import type { Amqp } from './Amqp'

export interface Job<Payload = void> {
  handle(amqp?: Amqp<Payload>): Promise<void>
}
