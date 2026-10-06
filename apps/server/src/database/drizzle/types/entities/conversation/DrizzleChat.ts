import type { chatModel } from '../../../models/conversation/chat-model'

export type DrizzleChat = typeof chatModel.$inferSelect
export type DrizzleInsertChat = typeof chatModel.$inferInsert
