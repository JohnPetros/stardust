import { sql } from 'drizzle-orm'
import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { chatMessageSenderModel } from './chat-message-sender-model'
import { chatModel } from './chat-model'

export const chatMessageModel = pgTable(
  'chat_messages',
  {
    id: uuid('id').notNull().default(sql`gen_random_uuid()`),
    content: text('content').notNull(),
    sender: chatMessageSenderModel('sender').notNull(),
    chatId: uuid('chat_id').notNull().default(sql`gen_random_uuid()`),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [chatModel.id],
      name: 'chat_messages_chat_id_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
    primaryKey({ columns: [table.id], name: 'chat_messages_pkey' }),
  ],
)
