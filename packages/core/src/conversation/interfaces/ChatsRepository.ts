import type { Chat } from '../domain/entities'
import type { ChatMessage } from '../domain/structures'
import type { Id } from '#global/domain/structures/Id'

export interface ChatsRepository {
  findAllByUser(userId: Id): Promise<Chat[]>
  add(chatMessage: ChatMessage): Promise<void>
  replace(chatMessage: ChatMessage): Promise<void>
  remove(chatId: Id): Promise<void>
}
