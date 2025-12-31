import type { Id } from '#global/domain/structures/Id'
import type { RestResponse } from '#global/responses/RestResponse'
import type { ChatMessage } from '../domain/structures'
import type { ChatMessageDto } from '../domain/structures/dtos/ChatMessageDto'

export interface ConversationService {
  fetchChatMessages(chatId: Id): Promise<RestResponse<ChatMessageDto[]>>
  sendChatMessage(chatId: Id, message: ChatMessage): Promise<RestResponse>
}
