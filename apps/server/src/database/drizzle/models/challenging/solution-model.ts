import { sql } from 'drizzle-orm'
import {
  bigint,
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { challengeModel } from './challenge-model'
import { userModel } from '../profile/user-model'

export const solutionModel = pgTable(
  'solutions',
  {
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
    title: text('title').notNull(),
    content: text('content').notNull(),
    challengeId: uuid('challenge_id').notNull(),
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    slug: text('slug').notNull(),
    userId: varchar('user_id').notNull(),
    viewsCount: bigint('views_count', { mode: 'number' }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.challengeId],
      foreignColumns: [challengeModel.id],
      name: 'public_solution_challenge_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'solution_pkey' }),
    unique('solutions_slug_key').on(table.slug),
    unique('solutions_title_key').on(table.title),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'solutions_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
