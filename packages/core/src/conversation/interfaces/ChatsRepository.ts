import type { Chat } from '../domain/entities'
import type { Id } from '#global/domain/structures/Id'

export interface ChatsRepository {
  findById(chatId: Id): Promise<Chat | null>
  findAllByUser(userId: Id): Promise<Chat[]>
  findLastCreatedByUser(userId: Id): Promise<Chat | null>
  add(chat: Chat, userId: Id): Promise<void>
  replace(chat: Chat): Promise<void>
  remove(chatId: Id): Promise<void>
}
