import type { Id } from '#global/domain/structures/Id'
import type { RestResponse } from '#global/responses/RestResponse'
import type { ChatMessageDto } from '../domain/structures/dtos/ChatMessageDto'

export interface ConversationService {
  fetchChatMessages(chatId: Id): Promise<RestResponse<ChatMessageDto[]>>
}
