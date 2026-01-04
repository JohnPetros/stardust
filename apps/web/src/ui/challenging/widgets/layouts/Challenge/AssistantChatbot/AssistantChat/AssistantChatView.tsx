import type { RefObject } from 'react'

import type { ChatMessage } from '@stardust/core/conversation/structures'

import { User } from '@/ui/global/widgets/components/Mdx/User'
import { AssistantMessage } from './AssistantMessage'
import { AssistantResponse } from './AssistantResponse'
import { ChatInput } from './ChatInput'
import type { ChatErrorType } from './ChatErrorType'
import { AssistantChatError } from '../AssistantChatError'

type Props = {
  messages: ChatMessage[]
  assistantMessageContentParts: string[]
  isAssistantThinking: boolean
  isAssistantAnswering: boolean
  isChatEmpty: boolean
  containerRef: RefObject<HTMLDivElement | null>
  chatErrorType: ChatErrorType | null
  onSendMessageButtonClick: (messageContent: string) => void
}

export const AssistantChatView = ({
  messages,
  isAssistantThinking,
  isAssistantAnswering,
  assistantMessageContentParts,
  isChatEmpty,
  containerRef,
  chatErrorType,
  onSendMessageButtonClick,
}: Props) => {
  return (
    <div className='relative flex flex-col justify-between h-full'>
      <div ref={containerRef} className='h-[42rem] overflow-y-auto px-6 pb-40'>
        {isChatEmpty && !chatErrorType && (
          <div className='h-full flex items-center justify-center text-sm text-zinc-500'>
            Nenhuma mensagem enviada ainda.
          </div>
        )}
        {messages.map((message, index, allMessages) => {
          if (message.sender.isUser.isTrue) {
            const isLastUserMessage = index === allMessages.length - 1
            return (
              <div key={message.id.value} className='w-full max-w-96 ml-auto'>
                <User hasAnimation={isLastUserMessage}>{message.content.value}</User>
              </div>
            )
          }
          return (
            <AssistantMessage key={message.id.value} isThinking={false}>
              {message.content.value}
            </AssistantMessage>
          )
        })}
        {isAssistantThinking && <AssistantMessage isThinking />}
        {assistantMessageContentParts.length > 0 && (
          <AssistantResponse parts={assistantMessageContentParts} />
        )}
        {chatErrorType && (
          <div className='space-y-2 mt-10'>
            <AssistantChatError chatErrorType={chatErrorType} />
          </div>
        )}
      </div>

      <div className='mt-auto -translate-y-8'>
        <ChatInput
          isDisabled={
            isAssistantThinking || isAssistantAnswering || Boolean(chatErrorType)
          }
          onSendMessage={onSendMessageButtonClick}
        />
      </div>
    </div>
  )
}
