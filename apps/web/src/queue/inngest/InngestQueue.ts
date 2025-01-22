import { AppError } from '@stardust/core/global/errors'
import type { IQueue, TimeExpression } from '@stardust/core/interfaces'
import type { Context } from 'inngest/types'

type InngestQueueProps = {
  step: Context['step']
  event: Context['event']
}

export const InngestQueue = <Payload>({
  step,
  event,
}: InngestQueueProps): IQueue<Payload> => {
  return {
    async run<Response>(callBack: () => Promise<unknown>, callbackName: string) {
      return step.run(`run ${callbackName}`, async () => await callBack()) as Response
    },

    async publish(event) {
      await step.sendEvent(`send.${event.name}.event`, {
        name: event.name,
        data: event.payload,
      })
    },

    async waitFor<Response>(
      eventName: string,
      timeOutExpression: TimeExpression,
      propToMatch?: string,
    ) {
      const event = await step.waitForEvent(`wait.for.${eventName}.event`, {
        event: eventName,
        timeout: timeOutExpression,
      })
      if (!event) throw new AppError('Event not defined')

      return event.data as Response
    },

    async sleepFor(timeExpression: TimeExpression) {
      await step.sleep(`sleep.for.${timeExpression}`, timeExpression)
    },

    getPayload() {
      return event.data
    },
  }
}
