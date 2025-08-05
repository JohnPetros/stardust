import { type ReactNode, useRef } from 'react'

import { Button } from '../Button'
import { AlertDialog } from '../AlertDialog'
import type { AlertDialogRef } from '../AlertDialog/types'

type PromptViewProps = {
  children?: ReactNode
  title: string
  value: string
  alertDialogRef: React.RefObject<AlertDialogRef | null>
  onValueChange: (value: string) => void
  onConfirm: () => void
  onCancel?: () => void
}

export const PromptView = ({
  children: trigger,
  title,
  value,
  alertDialogRef,
  onValueChange,
  onConfirm,
  onCancel,
}: PromptViewProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <AlertDialog
      ref={alertDialogRef}
      type='asking'
      title={title ?? 'Digite um valor no campo abaixo'}
      body={
        <div className='mx-auto my-6 w-4/5 items-center justify-center'>
          <input
            ref={(ref) => {
              inputRef.current = ref
              setTimeout(() => {
                inputRef.current?.focus()
              }, 10)
            }}
            type='text'
            value={value}
            onChange={({ currentTarget }) => onValueChange(currentTarget.value)}
            autoCapitalize='none'
            className='prompt-input w-full rounded border border-gray-100 bg-purple-700 p-2 text-sm text-gray-100 outline-none focus:border-green-500'
          />
        </div>
      }
      action={
        <Button className='w-32 bg-green-400 text-sm text-green-900' onClick={onConfirm}>
          Confirmar
        </Button>
      }
      cancel={
        <Button className='w-32 bg-red-700  text-sm text-gray-100' onClick={onCancel}>
          Cancelar
        </Button>
      }
      shouldPlayAudio={false}
      shouldForceMount={true}
    >
      {trigger}
    </AlertDialog>
  )
}
