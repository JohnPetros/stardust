import { ForwardedRef, forwardRef, useImperativeHandle } from 'react'

import { Alert } from '../Alert'
import { Button } from '../Button'

import { usePrompt } from './usePromp'

export type PromptRef = {
  open: () => void
  close: () => void
  focus: () => void
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
  const {
    title,
    value,
    alertRef,
    inputRef,
    open,
    focus,
    close,
    setTitle,
    setValue,
  } = usePrompt()

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
    [value, open, close, focus, setTitle, setValue]
  )

  return (
    <Alert
      ref={alertRef}
      type="asking"
      title={title ?? 'Digite um valor no campo abaixo'}
      body={
        <div className="mx-auto my-6 w-4/5 items-center justify-center">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={({ currentTarget }) => setValue(currentTarget.value)}
            autoCapitalize="none"
            autoFocus
            className="w-full rounded border border-gray-100 bg-purple-700 p-2 text-sm text-green-400 outline-none focus:border-green-500"
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
