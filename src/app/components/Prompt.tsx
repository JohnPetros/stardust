import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { Alert, AlertRef } from './Alert'
import { Button } from './Button'

export type PromptRef = {
  open: () => void
  close: () => void
  focus: () => void
  setTitle: (title: string) => void
  setValue: (value: string) => void
  value: string
}

interface PromptProps {
  onConfirm: () => void
  onCancel?: () => void
}

export function PromptComponent(
  { onConfirm, onCancel }: PromptProps,
  ref: ForwardedRef<PromptRef>
) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const alertRef = useRef<AlertRef | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  function open() {
    alertRef.current?.open()
  }

  function close() {
    alertRef.current?.close()
  }

  function focus() {
    inputRef.current?.focus()
  }

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
    [value]
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
