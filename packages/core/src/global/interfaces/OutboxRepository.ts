import type { Event } from '#global/domain/abstracts/index'
import type { Integer } from '#global/domain/structures/Integer'
import type { Text } from '#global/domain/structures/Text'
import type { OutboxEvent } from '#global/domain/types/OutboxEvent'

export interface OutboxRepository {
  enqueue(event: Event, eventId?: Text): Promise<void>
  reserve(now: Date, owner: Text, limit: Integer): Promise<OutboxEvent[]>
  markPublished(id: Text, owner: Text, now: Date): Promise<boolean>
  markFailed(
    id: Text,
    owner: Text,
    attempts: Integer,
    availableAt: Date,
    now: Date,
  ): Promise<boolean>
  recover(now: Date): Promise<void>
  cleanup(cutoff: Date): Promise<number>
}
