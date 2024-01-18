import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'

import { Alert } from '../Alert'
import { Button } from '../Button'

import { usePrompt } from './usePromp'

export type PromptRef = {
  open: () => void
  close: () => void
  setTitle: (title: string) => void
  setValue: (value: string) => void
  value: string
}

type PromptProps = {
  onConfirm: () => void
  onCancel?: () => void
}

export function PromptComponent(
  { onConfirm, onCancel }: PromptProps,
  ref: ForwardedRef<PromptRef>
) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { title, value, alertRef, open, close, setTitle, setValue } =
    usePrompt()

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
        focus,
        setTitle,
        setValue,
        value,
      }
    },
    [value, open, close, setTitle, setValue]
  )

  return (
    <Alert
      ref={alertRef}
      type="asking"
      title={title ?? 'Digite um valor no campo abaixo'}
      body={
        <div className="mx-auto my-6 w-4/5 items-center justify-center">
          <input
            ref={(ref) => {
              inputRef.current = ref
              setTimeout(() => {
                inputRef.current?.focus()
              }, 10)
            }}
            type="text"
            value={value}
            onChange={({ currentTarget }) => setValue(currentTarget.value)}
            autoCapitalize="none"
            className="prompt-input w-full rounded border border-gray-100 bg-purple-700 p-2 text-sm text-green-400 outline-none focus:border-green-500"
          />
        </div>
      }
      action={
        <Button
          className="w-32 bg-green-400 text-sm text-green-900"
          onClick={onConfirm}
        >
          Confirmar
        </Button>
      }
      cancel={
        <Button
          className="w-32 bg-red-700  text-sm text-gray-100"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      }
      canPlaySong={false}
      canForceMount={true}
    />
  )
}

export const Prompt = forwardRef(PromptComponent)
