import type { IQueue } from './IQueue'

export interface IJob<Payload = void> {
  eventName?: string
  handle(queue?: IQueue<Payload>): Promise<void>
}
