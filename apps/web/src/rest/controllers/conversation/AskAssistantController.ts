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

type Dependencies = {
  service: ConversationService
  workflow: ManualWorkflow
}

export const AskAssistantController = ({
  service,
  workflow,
}: Dependencies): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const routeParams = http.getRouteParams()
      const chatId = Id.create(routeParams.chatId)
      const { challengeId, question } = await http.getBody()
      const chatResponse = await service.fetchChatMessages(chatId)
      if (chatResponse.isFailure) chatResponse.throwError()

      const userMessageForAssistant = ChatMessage.create({
        content: `ID do desafio: ${challengeId}, pergunta: ${question}`,
        sender: 'user',
      })
      const userMessage = ChatMessage.create({
        content: question,
        sender: 'user',
        sentAt: userMessageForAssistant.sentAt.toISOString(),
      })

      const chatMessages = chatResponse.body
        .map(ChatMessage.create)
        .concat(userMessageForAssistant)

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
