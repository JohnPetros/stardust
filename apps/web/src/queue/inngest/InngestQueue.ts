import type { IQueue, IUseCase } from '@stardust/core/interfaces'
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
    async run<Response>(useCase: IUseCase, useCaseName: string) {
      return step.run(
        `run ${useCaseName}`,
        async () => await useCase.do(),
      ) as Response
    },

    async publish(event) {
      await step.sendEvent('send-event', { name: event.name, data: event.payload })
    },

    async waitFor(event, timeOutExpression) {
      step.waitForEvent('wait-for-event', {
        event: event.name,
        timeout: timeOutExpression,
      })
    },

    getPayload() {
      return event.data
    },
  }
}
