import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const rocketModel = pgTable(
  'rockets',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: varchar('name').notNull(),
    price: integer('price').notNull(),
    image: varchar('image').notNull(),
    isSelectedByDefault: boolean('is_selected_by_default').notNull().default(sql`false`),
    isAcquiredByDefault: boolean('is_acquired_by_default').notNull().default(sql`false`),
    isPurchasable: boolean('is_purchasable').notNull().default(sql`true`),
  },
  (table) => [
    unique('rockets_image_key').on(table.image),
    unique('rockets_name_key').on(table.name),
    primaryKey({ columns: [table.id], name: 'rockets_pkey' }),
  ],
)
