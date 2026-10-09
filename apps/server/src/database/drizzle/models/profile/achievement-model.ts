import { sql } from 'drizzle-orm'
import {
  bigint,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const achievementModel = pgTable(
  'achievements',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    icon: text('icon').notNull(),
    description: text('description').notNull(),
    metric: text('metric').notNull().default(sql`''::text`),
    requiredCount: bigint('required_count', { mode: 'number' }).notNull(),
    reward: integer('reward').notNull().default(sql`20`),
    position: integer('position').notNull(),
  },
  (table) => [
    unique('achievements_badge_achievement_key').on(table.icon),
    unique('achievements_description_achievement_key').on(table.description),
    unique('achievements_name_achievement_key').on(table.name),
    primaryKey({ columns: [table.id], name: 'achievements_pkey' }),
  ],
)
