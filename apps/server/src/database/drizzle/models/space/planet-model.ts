import { sql } from 'drizzle-orm'
import { boolean, integer, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'

export const planetModel = pgTable(
  'planets',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    image: text('image').notNull(),
    icon: text('icon').notNull(),
    position: integer('position').notNull(),
    isAvailable: boolean('is_available').notNull().default(sql`true`),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'planets_pkey' })],
)
