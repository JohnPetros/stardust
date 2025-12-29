import type { ConversationService as IConversationService } from '@stardust/core/conversation/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'

export const ConversationService = (restClient: RestClient): IConversationService => {
  return {
    async fetchChatMessages(chatId) {
      return await restClient.get(`/conversation/chat/${chatId.value}/messages`)
    },
  }
}
