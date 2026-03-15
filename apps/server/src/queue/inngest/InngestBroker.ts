import type { Broker } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'
import { inngest } from './inngest'

export class InngestBroker implements Broker {
  async publish(event: Event): Promise<void> {
    try {
      console.log('server inngest publish', event)
      await inngest.send({
        // @ts-ignore
        name: event.name,
        // @ts-ignore
        data: event.payload,
      })
    } catch (error) {
      console.error('server inngest error', error)
    }
  }
}
