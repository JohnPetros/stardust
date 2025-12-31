import { convertToModelMessages } from 'ai'

import type { ManualWorkflow } from '@stardust/core/manual/interfaces'
import { ChatMessage } from '@stardust/core/conversation/structures'

import { assistantAgent } from '../agents/manualAgents'
import { convertToUiMessages } from '../utils/convertToUiMessages'

export const VercelManualWorkflow = (): ManualWorkflow => {
  return {
    async assistUser(
      chatMessages: ChatMessage[],
      onFinish: (lastMessage: ChatMessage) => Promise<void>,
    ) {
      const uiMessages = convertToUiMessages(chatMessages)
      const modelMessages = await convertToModelMessages(uiMessages)

      const result = await assistantAgent.stream({ messages: modelMessages })

      return result.toUIMessageStreamResponse({
        originalMessages: uiMessages,
        onFinish: async ({ responseMessage }) => {
          let content = ''
          for (const part of responseMessage.parts) {
            if (part.type === 'text' && part.state === 'done') {
              content += part.text
            }
          }
          const lastMessage = ChatMessage.create({
            content,
            sentAt: new Date().toISOString(),
            sender: 'assistant',
          })
          await onFinish(lastMessage)
        },
      })
    },
  }
}
