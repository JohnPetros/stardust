import { sql } from 'drizzle-orm'
import {
  bigserial,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const outboxEventModel = pgTable(
  'outbox_events',
  {
    id: text('id').primaryKey().default(sql`gen_random_uuid()::text`),
    eventName: text('event_name').notNull(),
    payload: jsonb('payload').$type<unknown>().notNull(),
    sequence: bigserial('sequence', { mode: 'number' }).notNull(),
    status: text('status').notNull().default('pending'),
    attempts: integer('attempts').notNull().default(0),
    availableAt: timestamp('available_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true, mode: 'date' }),
    reservedBy: text('reserved_by'),
    reservationExpiresAt: timestamp('reservation_expires_at', {
      withTimezone: true,
      mode: 'date',
    }),
    lastErrorCode: text('last_error_code'),
  },
  (table) => [
    check(
      'outbox_events_status_check',
      sql`${table.status} in ('pending', 'publishing', 'published', 'failed')`,
    ),
    check('outbox_events_attempts_check', sql`${table.attempts} >= 0`),
    check(
      'outbox_events_reservation_check',
      sql`(
      ${table.status} = 'publishing' AND ${table.reservedBy} IS NOT NULL AND ${table.reservationExpiresAt} IS NOT NULL
    ) OR (
      ${table.status} <> 'publishing' AND ${table.reservedBy} IS NULL AND ${table.reservationExpiresAt} IS NULL
    )`,
    ),
    index('outbox_events_available_idx').on(
      table.status,
      table.availableAt,
      table.sequence,
    ),
    index('outbox_events_lease_idx').on(table.status, table.reservationExpiresAt),
    index('outbox_events_retention_idx').on(table.status, table.publishedAt),
  ],
)
