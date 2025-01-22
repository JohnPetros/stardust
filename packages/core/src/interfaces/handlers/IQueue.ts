import type { IEvent } from './IEvent'

export type TimeExpression = '1d' | '1h' | '1s'

export interface IQueue<Payload = void> {
  run<Response = void>(
    callBack: () => Promise<unknown>,
    callbackName: string,
  ): Promise<Response>
  publish(event: IEvent): Promise<void>
  waitFor<EventPayload>(
    eventName: string,
    timeExpression: TimeExpression,
    propToMatch?: string,
  ): Promise<EventPayload>
  sleepFor(timeExpression: TimeExpression): Promise<void>
  getPayload(): Payload
}
