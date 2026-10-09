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
import { feedbackReportModel } from './feedback-report-model'

export const feedbackMessageModel = pgTable(
  'feedback_messages',
  {
    id: uuid('id').notNull(),
    reportId: uuid('report_id').notNull(),
    authorRole: text('author_role').notNull(),
    authorId: varchar('author_id').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    check(
      'feedback_messages_author_role_check',
      sql`author_role = ANY (ARRAY['user'::text, 'admin'::text])`,
    ),
    check(
      'feedback_messages_content_check',
      sql`char_length(TRIM(BOTH FROM content)) >= 1 AND char_length(TRIM(BOTH FROM content)) <= 2000`,
    ),
    primaryKey({ columns: [table.id], name: 'feedback_messages_pkey' }),
    foreignKey({
      columns: [table.reportId],
      foreignColumns: [feedbackReportModel.id],
      name: 'feedback_messages_report_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    index('feedback_messages_report_idx').using(
      'btree',
      table.reportId,
      table.createdAt,
      table.id,
    ),
  ],
)
