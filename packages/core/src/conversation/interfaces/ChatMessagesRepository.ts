import type { ChatMessage } from '../domain/structures'
import type { ChatMessagesListingParams } from '../domain/types'

export interface ChatMessagesRepository {
  add(chatMessage: ChatMessage): Promise<void>
  findMany(params: ChatMessagesListingParams): Promise<ChatMessage[]>
}
