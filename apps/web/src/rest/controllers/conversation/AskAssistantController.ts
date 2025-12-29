import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { ChatMessageDto } from '@stardust/core/conversation/structures/dtos'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { ChatMessage } from '@stardust/core/conversation/structures'
import { Id } from '@stardust/core/global/structures'
import { ManualWorkflow } from '@stardust/core/manual/interfaces'

type Schema = {
  routeParams: {
    chatId: string
  }
  body: ChatMessageDto
}

export const AskAssistantController = (
  service: ConversationService,
  workflow: ManualWorkflow,
): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const { chatId } = http.getRouteParams()
      const userMessage = await http.getBody()
      const response = await service.fetchChatMessages(Id.create(chatId))
      if (response.isFailure) response.throwError()

      const chatMessages = response.body
        .map(ChatMessage.create)
        .concat(ChatMessage.create(userMessage))

      const result = await workflow.assistantUser(chatMessages, async (lastMessage) => {
        console.log(lastMessage)
      })
      return http.stream(result)
    },
  }
}
