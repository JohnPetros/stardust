import type { ConversationService as IConversationService } from '@stardust/core/conversation/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

export const ConversationService = (restClient: RestClient): IConversationService => {
  return {
    async fetchChatMessages(chatId) {
      return await restClient.get(`/conversation/chats/${chatId.value}/messages`)
    },

    async sendChatMessage(chatId, message) {
      return await restClient.post(
        `/conversation/chats/${chatId.value}/messages`,
        message.dto,
      )
    },
  }
}
