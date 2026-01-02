import type { Chat } from '../domain/entities'
import type { Id } from '#global/domain/structures/Id'
import type { ManyItems } from '../../global/domain/types'
import type { ChatsListingParams } from '../domain/types'

export interface ChatsRepository {
  findById(chatId: Id): Promise<Chat | null>
  findManyByUser(params: ChatsListingParams): Promise<ManyItems<Chat>>
  findLastCreatedByUser(userId: Id): Promise<Chat | null>
  add(chat: Chat, userId: Id): Promise<void>
  replace(chat: Chat): Promise<void>
  remove(chatId: Id): Promise<void>
}
