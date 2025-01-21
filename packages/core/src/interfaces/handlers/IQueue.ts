import type { IEvent } from './IEvent'
import type { IUseCase } from './IUseCase'

type TimeoutExpression = '1 day'

export interface IQueue<Payload = void> {
  run<Response>(useCase: IUseCase, message: string): Promise<Response>
  publish(event: IEvent): Promise<void>
  waitFor(event: IEvent, timeoutExpression: TimeoutExpression): void
  getPayload(): Payload
}
