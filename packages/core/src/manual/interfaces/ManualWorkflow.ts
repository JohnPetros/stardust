import type { ChatMessage } from '@stardust/core/conversation/structures'

export interface AssistUserWorkflow {
  run(
    chatMessages: ChatMessage[],
    onFinish: (lastMessage: ChatMessage) => Promise<void>,
  ): Promise<Response>
}
