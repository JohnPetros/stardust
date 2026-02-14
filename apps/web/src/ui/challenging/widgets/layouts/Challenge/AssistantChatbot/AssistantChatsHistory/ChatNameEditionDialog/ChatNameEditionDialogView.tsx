import { Prompt } from '@/ui/global/widgets/components/Prompt'
import type { PromptRef } from '@/ui/global/widgets/components/Prompt/types'
import type { ReactNode } from 'react'

type Props = {
  promptRef: React.RefObject<PromptRef | null>
  children: ReactNode
  handleConfirm: () => Promise<void>
  handleOpen: () => void
}

export const ChatNameEditionDialogView = ({
  promptRef,
  children,
  handleConfirm,
  handleOpen,
}: Props) => {
  return (
    <Prompt
      ref={promptRef}
      initialTitle=''
      onConfirm={handleConfirm}
      onCancel={() => promptRef.current?.close()}
    >
      <button
        type='button'
        onClick={handleOpen}
        className='transition-all hover:text-green-400 group-hover:opacity-100'
      >
        {children}
      </button>
    </Prompt>
  )
}
