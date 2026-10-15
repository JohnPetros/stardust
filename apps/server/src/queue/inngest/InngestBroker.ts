import type { Broker, OutboxRepository } from '@stardust/core/global/interfaces'
import type { Event } from '@stardust/core/global/abstracts'
import type { Text } from '@stardust/core/global/structures'

import { DrizzleClient } from '../../database/drizzle/DrizzleClient'
import { DrizzleOutboxRepository } from '../../database/drizzle/repositories/global/DrizzleOutboxRepository'

export class InngestBroker implements Broker {
  constructor(private readonly repository?: OutboxRepository) {}

  async publish(event: Event, eventId?: Text): Promise<void> {
    const repository =
      this.repository ??
      new DrizzleOutboxRepository(DrizzleClient.getInstance(), { kind: 'system' })
    await repository.enqueue(event, eventId)
  }
}
