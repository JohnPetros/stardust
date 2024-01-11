import { useMemo, useRef, useState } from 'react'

import { AlertRef } from '../Alert'

export function usePrompt() {
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

  return useMemo(
    () => ({
      title,
      value,
      inputRef,
      alertRef,
      setTitle,
      setValue,
      open,
      close,
      focus,
    }),
    [title, value]
  )
}
