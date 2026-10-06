import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { userModel } from '../profile/user-model'

export const commentModel = pgTable(
  'comments',
  {
    id: uuid('id').notNull().default(sql`uuid_generate_v4()`),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`(now() AT TIME ZONE 'utc'::text)`),
    content: text('content').notNull(),
    parentCommentId: uuid('parent_comment_id'),
    userId: varchar('user_id').notNull().default(sql`'apollo'::text`),
  },
  (table) => [
    check('comments_content_check', sql`length(content) >= 3`),
    foreignKey({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
      name: 'comments_parent_comment_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'comments_pkey' }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [userModel.id],
      name: 'comments_user_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)
