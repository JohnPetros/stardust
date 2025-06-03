import type { InngestAmqp } from './InngestAmqp'
import type { EventBroker } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'

export class InngestEventBroker implements EventBroker {
  constructor(private readonly inngestAmqp: InngestAmqp<void>) {}

  async publish(event: Event): Promise<void> {
    await this.inngestAmqp.sendEvent(event)
  }
}
