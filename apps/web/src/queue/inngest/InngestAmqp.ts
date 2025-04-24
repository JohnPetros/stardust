import { AppError } from '@stardust/core/global/errors'
import type { Amqp, TimeExpression } from '@stardust/core/global/interfaces'
import type { Context } from 'inngest/types'
import { inngest } from './client'

type InngestAmqpProps = {
  step?: Context['step']
  event?: Context['event']
}

export const InngestAmqp = <Payload>({
  step,
  event,
}: InngestAmqpProps = {}): Amqp<Payload> => {
  return {
    async run<Response>(callBack: () => Promise<unknown>, callbackName: string) {
      return (await step?.run(
        `run ${callbackName}`,
        async () => await callBack(),
      )) as Response
    },

    async publish(event) {
      if (!step) {
        await inngest.send({
          // @ts-ignore
          name: event.name,
          // @ts-ignore
          data: event.payload,
        })
        return
      }

      await step?.sendEvent(`send.${event.name}.event`, {
        name: event.name,
        data: event.payload,
      })
    },

    async waitFor<Response>(eventName: string, timeOutExpression: TimeExpression) {
      const event = await step?.waitForEvent(`wait.for.${eventName}.event`, {
        event: eventName,
        timeout: timeOutExpression,
      })
      if (!event) throw new AppError('Event not defined')

      return event.data as Response
    },

    async sleepFor(timeExpression: TimeExpression) {
      await step?.sleep(`sleep.for.${timeExpression}`, timeExpression)
    },

    getPayload() {
      return event?.data
    },
  }
}
