import { useMemo } from 'react'

import { IncrementAssistantChatMessageCountUseCase } from '@stardust/core/conversation/use-cases'

import { Animation } from '@/ui/global/widgets/components/Animation'
import type { ChatErrorType } from '../AssistantChat/ChatErrorType'

type Props = {
  chatErrorType: ChatErrorType
}

export const AssistantChatErrorView = ({ chatErrorType }: Props) => {
  const message = useMemo(() => {
    switch (chatErrorType) {
      case 'llm-quota-exceed':
        return 'Infelizmente, a inteligência artificial cansou de responder 😭.'
      case 'chat-messages-exceeded':
        return `Infelizmente, você excedeu o limite de ${IncrementAssistantChatMessageCountUseCase.MAX_MESSAGE_COUNT} mensagens permitidos por dia. `
      default:
        return 'Infelizmente, ocorreu um erro ao enviar sua mensagem'
    }
  }, [chatErrorType])

  return (
    <div className='flex flex-col'>
      <p className='text-red-700'>{message}</p>
      <Animation name='apollo-crying' size={80} />
    </div>
  )
}
