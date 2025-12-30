import type { Id } from '#global/domain/structures/Id'
import type { ChatMessage } from '../domain/structures'

export interface ChatMessagesRepository {
  findAllByChat(chatId: Id): Promise<ChatMessage[]>
  add(chatId: Id, chatMessage: ChatMessage): Promise<void>
}
