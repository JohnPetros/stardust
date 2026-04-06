import type { Broker } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'

export const InngestBroker = (): Broker => {
  return {
    async publish(event: Event): Promise<void> {
      const { inngest } = await import('./inngest')

      await inngest.send({
        // @ts-expect-error
        name: event.name,
        // @ts-expect-error
        data: event.payload,
      })
    },
  }
}
