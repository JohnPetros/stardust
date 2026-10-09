import { sql } from 'drizzle-orm'
import {
  bigint,
  check,
  foreignKey,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { feedbackMessageModel } from './feedback-message-model'

export const feedbackMessageAttachmentModel = pgTable(
  'feedback_message_attachments',
  {
    id: uuid('id').notNull(),
    messageId: uuid('message_id').notNull(),
    storageKey: text('storage_key').notNull(),
    originalName: text('original_name').notNull(),
    mimeType: text('mime_type').notNull(),
    size: bigint('size', { mode: 'number' }).notNull(),
    position: smallint('position').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.messageId],
      foreignColumns: [feedbackMessageModel.id],
      name: 'feedback_message_attachments_message_id_fkey',
    })
      .onUpdate('no action')
      .onDelete('cascade'),
    unique('feedback_message_attachments_message_id_position_key').on(
      table.messageId,
      table.position,
    ),
    check(
      'feedback_message_attachments_mime_type_check',
      sql`mime_type = ANY (ARRAY['image/png'::text, 'image/jpeg'::text])`,
    ),
    primaryKey({ columns: [table.id], name: 'feedback_message_attachments_pkey' }),
    check(
      'feedback_message_attachments_position_check',
      sql`"position" >= 0 AND "position" <= 2`,
    ),
    check('feedback_message_attachments_size_check', sql`size >= 1 AND size <= 10485760`),
    unique('feedback_message_attachments_storage_key_key').on(table.storageKey),
    index('feedback_message_attachments_message_idx').using(
      'btree',
      table.messageId,
      table.position,
    ),
  ],
)
