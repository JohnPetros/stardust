import type { Broker } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'
import type { Text } from '@stardust/core/global/structures'
import { inngest } from './inngest'

export class InngestBroker implements Broker {
  async publish(event: Event, eventId?: Text): Promise<void> {
    await inngest.send({
      name: event.name,
      id: eventId?.value,
      data: event.payload,
    })
  }
}
