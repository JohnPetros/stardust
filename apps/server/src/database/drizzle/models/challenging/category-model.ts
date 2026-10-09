import { sql } from 'drizzle-orm'
import { pgTable, primaryKey, uuid, varchar } from 'drizzle-orm/pg-core'

export const categoryModel = pgTable(
  'categories',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: varchar('name').notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'categories_pkey' })],
)
