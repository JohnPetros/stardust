import { useRef } from 'react'
import type { PromptRef } from '@/ui/global/widgets/components/Prompt/types'

type Params = {
  chatId: string
  initialChatName: string
  onEditChatName: (chatId: string, chatName: string) => Promise<void>
}

export const useChatNameEditionDialog = ({
  chatId,
  initialChatName,
  onEditChatName,
}: Params) => {
  const promptRef = useRef<PromptRef | null>(null)

  async function handleConfirm() {
    const chatName = promptRef.current?.value ?? ''
    if (chatName.length < 2) {
      promptRef.current?.close()
      return
    }

    try {
      await onEditChatName(chatId, chatName)
    } finally {
      promptRef.current?.close()
    }
  }

  function handleOpen() {
    promptRef.current?.setValue(initialChatName)
    promptRef.current?.setTitle('Editar nome do chat')
    promptRef.current?.open()
  }

  return {
    promptRef,
    handleConfirm,
    handleOpen,
  }
}
