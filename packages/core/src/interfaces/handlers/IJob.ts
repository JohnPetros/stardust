import type { IQueue } from './IQueue'

export interface IJob<Payload = void> {
  key: string
  eventName?: string
  handle(queue?: IQueue<Payload>): Promise<void>
}
