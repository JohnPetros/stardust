import type { ChatMessage } from '@stardust/core/conversation/structures'

export interface ManualWorkflow {
  assistUser(
    chatMessages: ChatMessage[],
    onFinish: (lastMessage: ChatMessage) => Promise<void>,
  ): Promise<Response>
}
