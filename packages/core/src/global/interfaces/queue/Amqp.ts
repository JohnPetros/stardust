import type { Event } from '#global/abstracts'

export type TimeExpression = '1d' | '1h' | '1s' | '2s' | '3s' | '20s'

export interface Amqp<Payload = void> {
  run<Response = void>(
    callBack: () => Promise<unknown>,
    callbackName: string,
  ): Promise<Response>
  publish(event: Event): Promise<void>
  waitFor<EventPayload>(
    eventName: string,
    timeExpression: TimeExpression,
    propToMatch?: string,
  ): Promise<EventPayload>
  sleepFor(timeExpression: TimeExpression): Promise<void>
  getPayload(): Payload
}
