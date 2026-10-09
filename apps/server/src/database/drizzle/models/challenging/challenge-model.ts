import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { starModel } from '../space/star-model'
import { userModel } from '../profile/user-model'

export const challengeModel = pgTable(
  'challenges',
  {
    title: varchar('title').notNull().default(sql`''::character varying`),
    difficultyLevel: varchar('difficulty_level')
      .notNull()
      .default(sql`'easy'::character varying`),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    starId: uuid('star_id'),
    initialCode: text('initial_code').notNull(),
    texts: jsonb('texts'),
    functionName: text('function_name'),
    testCases: jsonb('test_cases').notNull(),
    slug: text('slug').notNull(),
    userId: varchar('user_id').notNull(),
    description: text('description'),
    isPublic: boolean('is_public').notNull().default(sql`false`),
    isNew: boolean('is_new').notNull().default(sql`false`),
    isEvaluatedByFunction: boolean('is_evaluated_by_function')
      .notNull()
      .default(sql`true`),
    officialSolution: jsonb('official_solution'),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'challenges_pkey' }),
    foreignKey({
      columns: [table.starId],
      foreignColumns: [starModel.id],
      name: 'challenges_star_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'challenges_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
