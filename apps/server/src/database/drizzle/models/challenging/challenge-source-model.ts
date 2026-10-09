import { sql } from 'drizzle-orm'
import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { challengeModel } from './challenge-model'

export const challengeSourceModel = pgTable(
  'challenge_sources',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    challengeId: uuid('challenge_id'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
    url: text('url').notNull(),
    position: integer('position').notNull(),
    additionalInstructions: text('additional_instructions'),
  },
  (table) => [
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'challenge_sources_challenge_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('set null'),
    primaryKey({ columns: [table.id], name: 'challenge_sources_pkey' }),
    unique('challenge_sources_position_key').on(table.position),
  ],
)
