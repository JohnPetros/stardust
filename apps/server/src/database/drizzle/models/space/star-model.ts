import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import { planetModel } from './planet-model'

export const starModel = pgTable(
  'stars',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    number: integer('number').notNull(),
    isChallenge: boolean('is_challenge').notNull().default(sql`false`),
    planetId: uuid('planet_id').notNull(),
    texts: jsonb('texts').$type<TextBlockDto[]>(),
    questions: jsonb('questions').$type<QuestionDto[]>(),
    slug: text('slug').notNull(),
    story: text('story').default(sql`''::text`),
    isAvailable: boolean('is_available').notNull().default(sql`true`),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'stars_pkey' }),
    foreignKey({
      columns: [table.planetId],
      foreignColumns: [planetModel.id],
      name: 'stars_planet_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
  ],
)
