import { sql, type BuildExtraConfigColumns } from 'drizzle-orm'
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
import { feedbackIntentModel } from './feedback-intent-model'
import { userModel } from '../profile/user-model'

const feedbackReportColumns = {
  id: uuid('id').notNull().default(sql`gen_random_uuid()`),
  content: text('content').notNull(),
  screenshot: text('screenshot'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .default(sql`now()`),
  intent: feedbackIntentModel('intent').notNull(),
  userId: varchar('user_id').notNull(),
  title: varchar('title', { length: 60 }).notNull().default(sql`''::character varying`),
  status: text('status').notNull().default(sql`'open'::text`),
  lastActivityAt: timestamp('last_activity_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  lastUserMessageAt: timestamp('last_user_message_at', {
    withTimezone: true,
    mode: 'date',
  }),
  studioReadAt: timestamp('studio_read_at', { withTimezone: true, mode: 'date' }),
  lastAdminMessageAt: timestamp('last_admin_message_at', {
    withTimezone: true,
    mode: 'date',
  }),
  authorReadAt: timestamp('author_read_at', { withTimezone: true, mode: 'date' }),
}
type FeedbackReportColumns = BuildExtraConfigColumns<
  'feedback_reports',
  typeof feedbackReportColumns,
  'pg'
>

export const feedbackReportModel = pgTable(
  'feedback_reports',
  feedbackReportColumns,
  (table) => [
    reportPrimaryKey(table),
    reportStatusValidation(),
    reportTitleValidation(),
    reportAuthorReference(table),
    authorHistoryIndex(table),
    authorUnreadIndex(table),
    queueIndex(table),
    studioUnreadIndex(table),
    reportUserIndex(table),
  ],
)

function reportPrimaryKey({ id }: FeedbackReportColumns) {
  return primaryKey({ columns: [id], name: 'feedback_reports_pkey' })
}

function reportStatusValidation() {
  return check(
    'feedback_reports_status_check',
    sql`status = ANY (ARRAY['open'::text, 'closed'::text])`,
  )
}

function reportTitleValidation() {
  return check(
    'feedback_reports_title_length_check',
    sql`char_length(title::text) >= 1 AND char_length(title::text) <= 60`,
  )
}

function reportAuthorReference({ userId }: FeedbackReportColumns) {
  return foreignKey({
    columns: [userId],
    foreignColumns: [userModel.id],
    name: 'feedback_reports_user_id_fkey',
  })
    .onUpdate('cascade')
    .onDelete('cascade')
}

function authorHistoryIndex({ userId, lastActivityAt, id }: FeedbackReportColumns) {
  return index('feedback_reports_author_history_idx').using(
    'btree',
    userId,
    lastActivityAt.desc().nullsFirst(),
    id.desc().nullsFirst(),
  )
}

function authorUnreadIndex({ userId, lastAdminMessageAt }: FeedbackReportColumns) {
  return index('feedback_reports_author_unread_idx')
    .using('btree', userId, lastAdminMessageAt.desc().nullsFirst())
    .where(
      sql`((last_admin_message_at IS NOT NULL) AND ((author_read_at IS NULL) OR (last_admin_message_at > author_read_at)))`,
    )
}

function queueIndex({ status, lastActivityAt, id }: FeedbackReportColumns) {
  return index('feedback_reports_queue_idx').using(
    'btree',
    status,
    lastActivityAt.desc().nullsFirst(),
    id.desc().nullsFirst(),
  )
}

function studioUnreadIndex({ lastUserMessageAt, studioReadAt }: FeedbackReportColumns) {
  return index('feedback_reports_unread_idx').using(
    'btree',
    lastUserMessageAt,
    studioReadAt,
  )
}

function reportUserIndex({ userId }: FeedbackReportColumns) {
  return index('feedback_reports_user_idx').using('btree', userId)
}
