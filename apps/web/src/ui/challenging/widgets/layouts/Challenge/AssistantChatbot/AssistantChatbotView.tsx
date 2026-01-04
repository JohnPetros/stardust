import type { ChatMessage } from '@stardust/core/conversation/structures'
import type { Chat } from '@stardust/core/conversation/entities'
import type { Id } from '@stardust/core/global/structures'
import type { ChatDto } from '@stardust/core/conversation/entities/dtos'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { AssistantChatsHistory } from './AssistantChatsHistory'
import { StarBorder } from '@/ui/global/widgets/components/StarBorder'
import { Button } from '@/ui/global/widgets/components/Button'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { AssistantGreeting } from './AssistantGreeting'
import { AssistantChat } from './AssistantChat'

type Props = {
  selectedChat: Chat | null
  firstQuestion: string | null
  chatMessages: ChatMessage[]
  challengeId: Id
  isLoading: boolean
  onCreateChat: (question?: string) => void
  onSelectChat: (chatDto: ChatDto) => void
  onDeleteChat: (chatId: string) => void
  onSendFirstQuestion: () => void
}

export const AssistantChatbotView = ({
  selectedChat,
  chatMessages,
  challengeId,
  isLoading,
  firstQuestion,
  onCreateChat,
  onDeleteChat,
  onSelectChat,
  onSendFirstQuestion,
}: Props) => {
  return (
    <div className='flex flex-col h-[calc(100vh-8rem)]'>
      <div className='flex items-center justify-between bg-gray-700 p-1 rounded-t-md border border-gray-700'>
        <StarBorder className='px-4 py-1'>
          <div className='flex items-center gap-2 text-green-400'>
            <span className='text-sm'>Assistente de código</span>
            <Icon name='ai' size={16} />
          </div>
        </StarBorder>
        <div className='flex items-center'>
          <button
            type='button'
            onClick={() => onCreateChat()}
            className='p-2 rounded-md text-green-400 hover:bg-gray-800'
          >
            <Icon name='plus' size={20} />
          </button>
          <AssistantChatsHistory onSelectChat={onSelectChat} onDeleteChat={onDeleteChat}>
            <button
              type='button'
              className='p-2 rounded-md text-green-400 hover:bg-gray-800'
            >
              <Icon name='history' size={20} />
            </button>
          </AssistantChatsHistory>
        </div>
      </div>
      <div className='h-full flex flex-col pt-4'>
        {isLoading && (
          <div className='h-full flex items-center justify-center'>
            <Loading />
          </div>
        )}
        {!isLoading && !selectedChat && (
          <div className='flex flex-col items-center justify-center'>
            <AssistantGreeting />
            <Button
              className='max-w-80 mt-6'
              onClick={() => onCreateChat('Ajude-me com este desafio')}
            >
              Pedir para ajuda ao assistente
            </Button>
          </div>
        )}
        {!isLoading && selectedChat && (
          <div className='h-full flex-col gap-4'>
            <h2 className='text-md text-center text-gray-400 font-bold'>
              {selectedChat.name.value}
            </h2>
            <AssistantChat
              chatId={selectedChat.id}
              challengeId={challengeId}
              initialMessages={chatMessages}
              firstQuestion={firstQuestion}
              onSendFirstQuestion={onSendFirstQuestion}
            />
          </div>
        )}
      </div>
    </div>
  )
}
