import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ManualWorkflow } from '@stardust/core/manual/interfaces'
import { ChatMessage } from '@stardust/core/conversation/structures'
import { Id } from '@stardust/core/global/structures'

type Schema = {
  routeParams: {
    chatId: string
  }
  body: {
    question: string
    challengeId: string
  }
}

export const AskAssistantController = (
  service: ConversationService,
  workflow: ManualWorkflow,
): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const routeParams = http.getRouteParams()
      const chatId = Id.create(routeParams.chatId)
      const { challengeId, question } = await http.getBody()
      const response = await service.fetchChatMessages(chatId)
      if (response.isFailure) response.throwError()

      const userMessage = ChatMessage.create({
        content: `ID do desafio: ${challengeId}, pergunta: ${question}`,
        sender: 'user',
      })

      const chatMessages = response.body.map(ChatMessage.create).concat(userMessage)

      const result = await workflow.assistUser(
        chatMessages,
        async (assistantMessage: ChatMessage) => {
          const userMessageResponse = await service.sendChatMessage(chatId, userMessage)
          if (userMessageResponse.isFailure) userMessageResponse.throwError()
          const assistantMessageResponse = await service.sendChatMessage(
            chatId,
            assistantMessage,
          )
          if (assistantMessageResponse.isFailure) assistantMessageResponse.throwError()
        },
      )
      return http.stream(result)
    },
  }
}
