import { sql } from 'drizzle-orm'
import { bigint, boolean, pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core'

export const avatarModel = pgTable(
  'avatars',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    image: text('image').notNull(),
    price: bigint('price', { mode: 'number' }).notNull(),
    isSelectedByDefault: boolean('is_selected_by_default').notNull().default(sql`false`),
    isAcquiredByDefault: boolean('is_acquired_by_default').notNull().default(sql`false`),
    isPurchasable: boolean('is_purchasable').notNull().default(sql`true`),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'avatars_pkey' })],
)
