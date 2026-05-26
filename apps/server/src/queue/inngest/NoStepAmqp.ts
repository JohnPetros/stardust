import { AppError } from '@stardust/core/global/errors'
import type { Amqp } from '@stardust/core/global/interfaces'

export class NoStepAmqp<Payload> implements Amqp<Payload> {
  constructor(private readonly payload: Payload) {}

  async run<Response = void>(callback: () => Promise<unknown>): Promise<Response> {
    return (await callback()) as Response
  }

  async waitFor<EventPayload>(): Promise<EventPayload> {
    throw new AppError('waitFor nao esta disponivel sem step do Inngest')
  }

  async sleepFor(): Promise<void> {
    throw new AppError('sleepFor nao esta disponivel sem step do Inngest')
  }

  getPayload(): Payload {
    return this.payload
  }
}
