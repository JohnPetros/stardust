import { sql } from 'drizzle-orm'
import { integer, pgTable, primaryKey, text, unique, uuid } from 'drizzle-orm/pg-core'

export const tierModel = pgTable(
  'tiers',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    image: text('image').notNull(),
    position: integer('position').notNull().default(sql`1`),
    reward: integer('reward').notNull(),
  },
  (table) => [
    unique('rankings_name_key').on(table.name),
    primaryKey({ columns: [table.id], name: 'rankings_pkey' }),
  ],
)
