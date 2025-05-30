import type { EventBroker } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'
import { inngest } from './client'

export class InngestEventBroker implements EventBroker {
  async publish(event: Event): Promise<void> {
    await inngest.send({
      // @ts-ignore
      name: event.name,
      // @ts-ignore
      data: event.payload,
    })
  }
}
