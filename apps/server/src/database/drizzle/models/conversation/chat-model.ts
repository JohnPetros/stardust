import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { userModel } from '../profile/user-model'

export const chatModel = pgTable(
  'chats',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    userId: varchar('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'chats_pkey' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'chats_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
