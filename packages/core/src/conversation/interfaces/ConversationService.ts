import type { Text } from '#global/domain/structures/Text'
import type { Id } from '#global/domain/structures/Id'
import type { RestResponse } from '#global/responses/RestResponse'
import type { FilteringParams, PaginationResponse } from '../../main'
import type { ChatDto } from '../domain/entities/dtos'
import type { ChatMessage } from '../domain/structures'
import type { ChatMessageDto } from '../domain/structures/dtos/ChatMessageDto'

export interface ConversationService {
  fetchChats(
    filteringParams: FilteringParams,
  ): Promise<RestResponse<PaginationResponse<ChatDto>>>
  fetchChatMessages(chatId: Id): Promise<RestResponse<ChatMessageDto[]>>
  sendChatMessage(chatId: Id, message: ChatMessage): Promise<RestResponse>
  editChatName(chatId: Id, chatName: Text): Promise<RestResponse<ChatDto>>
  createChat(): Promise<RestResponse<ChatDto>>
  deleteChat(chatId: Id): Promise<RestResponse>
  incrementAssistantChatMessageCount(): Promise<RestResponse>
}
