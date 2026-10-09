import type { chatMessageModel } from '../../../models/conversation/chat-message-model'

export type DrizzleChatMessage = typeof chatMessageModel.$inferSelect
export type DrizzleInsertChatMessage = typeof chatMessageModel.$inferInsert
