import type { ReactNode } from 'react'

import { useChatNameEditionDialog } from './useChatNameEditionDialog'
import { ChatNameEditionDialogView } from './ChatNameEditionDialogView'

type Props = {
  chatId: string
  initialChatName: string
  children: ReactNode
  onEditChatName: (chatId: string, chatName: string) => Promise<void>
}

export const ChatNameEditionDialog = ({
  chatId,
  initialChatName,
  onEditChatName,
  children,
}: Props) => {
  const { promptRef, handleConfirm, handleOpen } = useChatNameEditionDialog({
    chatId,
    initialChatName,
    onEditChatName,
  })

  return (
    <ChatNameEditionDialogView
      promptRef={promptRef}
      handleConfirm={handleConfirm}
      handleOpen={handleOpen}
    >
      {children}
    </ChatNameEditionDialogView>
  )
}
