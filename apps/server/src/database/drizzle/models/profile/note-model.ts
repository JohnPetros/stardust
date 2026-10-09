import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { userModel } from './user-model'

export const noteModel = pgTable(
  'notes',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    content: text('content').notNull().default(sql`''::text`),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    userId: varchar('user_id').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'notes_pkey' }),
    check('notes_title_check', sql`length(title) >= 1`),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'notes_user_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    index('notes_user_id_updated_at_idx').using(
      'btree',
      table.userId,
      table.updatedAt.desc().nullsFirst(),
    ),
  ],
)
