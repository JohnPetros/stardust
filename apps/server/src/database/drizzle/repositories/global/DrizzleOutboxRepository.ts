import { randomUUID } from 'node:crypto'
import { and, asc, eq, inArray, lt, lte, or } from 'drizzle-orm'
import type { Event } from '@stardust/core/global/abstracts'
import type { OutboxRepository } from '@stardust/core/global/interfaces'
import type { Integer, Text } from '@stardust/core/global/structures'
import type { OutboxEvent } from '@stardust/core/global/types'

import { DrizzleRepository } from '../../DrizzleRepository'
import { outboxEventModel } from '../../models/global/outbox-event-model'

type OutboxUpdate = Partial<typeof outboxEventModel.$inferInsert>

const reservedEventFields = {
  id: outboxEventModel.id,
  name: outboxEventModel.eventName,
  payload: outboxEventModel.payload,
  attempts: outboxEventModel.attempts,
  sequence: outboxEventModel.sequence,
}

export class DrizzleOutboxRepository
  extends DrizzleRepository
  implements OutboxRepository
{
  async enqueue(event: Event, eventId?: Text): Promise<void> {
    const values = this.eventValues(event, eventId)
    await this.executeQuery(() =>
      this.database
        .insert(outboxEventModel)
        .values(values)
        .onConflictDoNothing({ target: outboxEventModel.id }),
    )
  }

  private eventValues(event: Event, eventId?: Text) {
    return {
      id: eventId?.value ?? randomUUID(),
      eventName: event.name,
      payload: event.payload,
    }
  }

  async reserve(now: Date, owner: Text, limit: Integer): Promise<OutboxEvent[]> {
    const rows = await this.executeQuery(() =>
      this.database
        .update(outboxEventModel)
        .set(this.reservation(now, owner))
        .where(inArray(outboxEventModel.id, this.candidates(now, limit)))
        .returning(reservedEventFields),
    )
    return rows
      .sort((left, right) => left.sequence - right.sequence)
      .map(({ sequence: _sequence, ...event }) => event)
  }

  private candidates(now: Date, limit: Integer) {
    return this.pendingEvents(now)
      .orderBy(asc(outboxEventModel.sequence))
      .limit(Math.min(100, limit.value))
      .for('update', { skipLocked: true })
  }

  private pendingEvents(now: Date) {
    return this.database
      .select({ id: outboxEventModel.id })
      .from(outboxEventModel)
      .where(this.pendingFilter(now))
  }

  private pendingFilter(now: Date) {
    return and(
      eq(outboxEventModel.status, 'pending'),
      lte(outboxEventModel.availableAt, now),
    )
  }

  private reservation(now: Date, owner: Text): OutboxUpdate {
    return {
      status: 'publishing',
      reservedBy: owner.value,
      reservationExpiresAt: new Date(now.getTime() + 5 * 60_000),
      updatedAt: now,
    }
  }

  async markPublished(id: Text, owner: Text, now: Date): Promise<boolean> {
    return this.updateReservation(id, owner, {
      ...this.releasedReservation(now),
      status: 'published',
      publishedAt: now,
      lastErrorCode: null,
    })
  }

  async markFailed(
    id: Text,
    owner: Text,
    attempts: Integer,
    availableAt: Date,
    now: Date,
  ): Promise<boolean> {
    return this.updateReservation(id, owner, {
      ...this.releasedReservation(now),
      status: 'failed',
      attempts: attempts.value,
      availableAt,
      lastErrorCode: 'delivery_failed',
    })
  }

  private async updateReservation(
    id: Text,
    owner: Text,
    values: OutboxUpdate,
  ): Promise<boolean> {
    const rows = await this.executeQuery(() =>
      this.database
        .update(outboxEventModel)
        .set(values)
        .where(this.reservationFilter(id, owner))
        .returning({ id: outboxEventModel.id }),
    )
    return rows.length === 1
  }

  private releasedReservation(now: Date): OutboxUpdate {
    return { updatedAt: now, reservedBy: null, reservationExpiresAt: null }
  }

  private reservationFilter(id: Text, owner: Text) {
    return and(
      eq(outboxEventModel.id, id.value),
      eq(outboxEventModel.reservedBy, owner.value),
      eq(outboxEventModel.status, 'publishing'),
    )
  }

  async recover(now: Date): Promise<void> {
    await this.executeQuery(() =>
      this.database
        .update(outboxEventModel)
        .set({ ...this.releasedReservation(now), status: 'pending' })
        .where(or(this.expiredReservation(now), this.retryableFailure(now))),
    )
  }

  private expiredReservation(now: Date) {
    return and(
      eq(outboxEventModel.status, 'publishing'),
      lte(outboxEventModel.reservationExpiresAt, now),
    )
  }

  private retryableFailure(now: Date) {
    return and(
      eq(outboxEventModel.status, 'failed'),
      lt(outboxEventModel.attempts, 10),
      lte(outboxEventModel.availableAt, now),
    )
  }

  async cleanup(cutoff: Date): Promise<number> {
    const rows = await this.executeQuery(() =>
      this.database
        .delete(outboxEventModel)
        .where(
          and(
            eq(outboxEventModel.status, 'published'),
            lt(outboxEventModel.publishedAt, cutoff),
          ),
        )
        .returning({ id: outboxEventModel.id }),
    )
    return rows.length
  }
}
