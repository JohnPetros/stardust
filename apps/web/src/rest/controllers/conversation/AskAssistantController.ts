import type { ConversationService } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ManualWorkflow } from '@stardust/core/manual/interfaces'
import { ChatMessage } from '@stardust/core/conversation/structures'
import { Id } from '@stardust/core/global/structures'
import type {
  TextSelectionDto,
  CodeSelectionDto,
} from '@stardust/core/global/structures/dtos'

type Schema = {
  routeParams: {
    chatId: string
  }
  body: {
    question: string
    challengeId: string
    textSelection?: TextSelectionDto | null
    codeSelection?: CodeSelectionDto | null
  }
}

type Dependencies = {
  service: ConversationService
  workflow: ManualWorkflow
}

function buildContextMessage(
  challengeId: string,
  question: string,
  textSelection?: TextSelectionDto | null,
  codeSelection?: CodeSelectionDto | null,
): string {
  let context = `ID do desafio: ${challengeId}`

  if (textSelection) {
    context += `\n\nTexto selecionado:\n${textSelection.content}`
  }

  if (codeSelection) {
    context += `\n\nCódigo selecionado (linhas ${codeSelection.startLine}-${codeSelection.endLine}):\n${codeSelection.content}`
  }

  context += `\n\nPergunta: ${question}`

  return context
}

export const AskAssistantController = ({
  service,
  workflow,
}: Dependencies): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const routeParams = http.getRouteParams()
      const chatId = Id.create(routeParams.chatId)
      const { challengeId, question, textSelection, codeSelection } = await http.getBody()
      const chatResponse = await service.fetchChatMessages(chatId)
      if (chatResponse.isFailure) chatResponse.throwError()

      const contextMessage = buildContextMessage(
        challengeId,
        question,
        textSelection,
        codeSelection,
      )

      const userMessageForAssistant = ChatMessage.create({
        content: contextMessage,
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
