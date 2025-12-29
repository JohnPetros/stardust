import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { ChatMessageDto } from '@stardust/core/conversation/structures/dtos'
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
      const { chatId } = http.getRouteParams()
      const { challengeId, question } = await http.getBody()
      const response = await service.fetchChatMessages(Id.create(chatId))
      if (response.isFailure) response.throwError()

      const chatMessages = response.body
        .map(ChatMessage.create)
        .concat(ChatMessage.create({
          content: `ID do desafio: ${challengeId}, pergunta: ${question}`,
          sender: 'user'
        }))

      const result = await workflow.assistantUser(chatMessages, async (lastMessage) => {
        console.log(lastMessage)
      })
      return http.stream(result)
    },
  }
}
