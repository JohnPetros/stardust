import { pgEnum } from 'drizzle-orm/pg-core'

export const chatMessageSenderModel = pgEnum('chat_message_sender', ['user', 'assistant'])
