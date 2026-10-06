import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { insigniaRoleModel } from './insignia-role-model'

export const insigniaModel = pgTable(
  'insignias',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    image: text('image').notNull(),
    role: insigniaRoleModel('role').notNull(),
    isPurchasable: boolean('is_purchasable').notNull().default(sql`false`),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'insignias_pkey' }),
    unique('insignias_role_key').on(table.role),
  ],
)
