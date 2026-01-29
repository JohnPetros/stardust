import type { ReactNode, RefObject } from 'react'

import type { Chat } from '@stardust/core/conversation/entities'
import type { ChatDto } from '@stardust/core/conversation/entities/dtos'
import { Datetime } from '@stardust/core/global/libs'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { InfiniteList } from '@/ui/global/widgets/components/InfiniteList'
import type { DialogRef } from '@/ui/global/widgets/components/Dialog/types'

type Props = {
  children: ReactNode
  chats: Chat[]
  isLoading: boolean
  isReachedEnd: boolean
  dialogRef: RefObject<DialogRef | null>
  onOpenChange: (isOpen: boolean) => void
  onSelectChat: (chatDto: ChatDto) => void
  onShowMore: () => void
  onDeleteChat?: (chatId: string) => void
}

export const AssistantChatsHistoryView = ({
  children,
  chats,
  dialogRef,
  isLoading,
  isReachedEnd,
  onOpenChange,
  onSelectChat,
  onShowMore,
  onDeleteChat,
}: Props) => {
  return (
    <Dialog.Container ref={dialogRef} onOpenChange={onOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content className='max-w-2xl bg-zinc-950 p-0 text-gray-200'>
        <Dialog.Header>Histórico de conversas</Dialog.Header>
        <div className='max-h-[60vh] overflow-y-auto px-2 pb-2'>
          {chats.length === 0 && !isLoading ? (
            <p className='p-4 text-center text-gray-400'>Nenhuma conversa encontrada.</p>
          ) : (
            <InfiniteList
              className='flex flex-col mt-3'
              onShowMore={onShowMore}
              isReachedEnd={isReachedEnd}
              isLoading={isLoading}
            >
              {chats.map((chat) => (
                <div key={chat.id.value} className='group relative'>
                  <Button
                    className='flex h-auto w-full items-center justify-between rounded-lg border-0 bg-transparent pl-4 pr-12 py-3 hover:bg-white/5'
                    onClick={() => onSelectChat(chat.dto)}
                  >
                    <span className='truncate font-medium text-gray-300 group-hover:text-white'>
                      {chat.name.value}
                    </span>

                    <div className='flex items-center gap-3'>
                      <span className='whitespace-nowrap text-xs text-gray-500 transition-colors group-hover:text-gray-400'>
                        {new Datetime(chat.createdAt).formatTimeAgo()}
                      </span>
                    </div>
                  </Button>
                  <button
                    type='button'
                    className='absolute top-[12px] right-3 transition-all hover:text-red-400 group-hover:opacity-100'
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat?.(chat.id.value)
                    }}
                  >
                    <Icon name='trash' size={16} />
                  </button>
                </div>
              ))}
            </InfiniteList>
          )}

          {chats.length === 0 && isLoading && (
            <div className='flex justify-center p-4'>
              <Loading />
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Container>
  )
}
