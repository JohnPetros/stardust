import type { Chat } from '../domain/entities'
import type { Id } from '#global/domain/structures/Id'
import type { ChatMessage } from '../domain/structures'

export interface ChatsRepository {
  findById(chatId: Id): Promise<Chat | null>
  findAllByUser(userId: Id): Promise<Chat[]>
  findLastCreatedByUser(userId: Id): Promise<Chat | null>
  findAllMessagesByChat(chatId: Id): Promise<ChatMessage[]>
  add(chat: Chat, userId: Id): Promise<void>
  replace(chat: Chat): Promise<void>
  remove(chatId: Id): Promise<void>
  addMessage(chatId: Id, chatMessage: ChatMessage): Promise<void>
}
