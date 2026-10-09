import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { userModel } from '../profile/user-model'

export const snippetModel = pgTable(
  'snippets',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    title: text('title').notNull().default(sql`'Sem título'::text`),
    code: text('code').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    isPublic: boolean('is_public').notNull().default(sql`true`),
    userId: varchar('user_id').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'codes_pkey' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'snippets_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
