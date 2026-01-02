import type { ConversationService as IConversationService } from '@stardust/core/conversation/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { FilteringParams } from '@stardust/core/global/types'

export const ConversationService = (restClient: RestClient): IConversationService => {
  return {
    async fetchChats({ search, page, itemsPerPage }: FilteringParams) {
      restClient.setQueryParam('search', search?.value ?? '')
      restClient.setQueryParam('page', page.value.toString())
      restClient.setQueryParam('itemsPerPage', itemsPerPage.value.toString())
      return await restClient.get('/conversation/chats')
    },

    async fetchChatMessages(chatId) {
      return await restClient.get(`/conversation/chats/${chatId.value}/messages`)
    },

    async sendChatMessage(chatId, message) {
      return await restClient.post(
        `/conversation/chats/${chatId.value}/messages`,
        message.dto,
      )
    },

    async createChat() {
      return await restClient.post('/conversation/chats')
    },

    async deleteChat(chatId) {
      return await restClient.delete(`/conversation/chats/${chatId.value}`)
    },

    async incrementAssistantChatMessageCount() {
      return await restClient.patch('/conversation/chats/assistant')
    },
  }
}
