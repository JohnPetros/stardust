import type { Context } from 'inngest'

import type { Amqp, TimeExpression } from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'

type Props = {
  step?: Context['step']
  event?: Context['event']
}

export class InngestAmqp<Payload> implements Amqp<Payload> {
  private readonly step?: Context['step']
  private readonly event?: Context['event']

  constructor({ step, event }: Props = {}) {
    this.step = step
    this.event = event
  }

  async run<Response = void>(
    callBack: () => Promise<unknown>,
    callbackName: string,
  ): Promise<Response> {
    return (await this.step?.run(
      `run ${callbackName}`,
      async () => await callBack(),
    )) as Response
  }

  async waitFor<EventPayload>(
    eventName: string,
    timeOutExpression: TimeExpression,
  ): Promise<EventPayload> {
    const event = await this.step?.waitForEvent(`wait.for.${eventName}.event`, {
      event: eventName,
      timeout: timeOutExpression,
    })
    if (!event) throw new AppError('Event not defined')

    return event.data as EventPayload
  }

  async sleepFor(timeExpression: TimeExpression): Promise<void> {
    await this.step?.sleep(`sleep.for.${timeExpression}`, timeExpression)
  }

  getPayload(): Payload {
    return this.event?.data
  }
}
