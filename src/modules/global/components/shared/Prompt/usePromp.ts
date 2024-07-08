import { useRef, useState } from 'react'

import { AlertDialogRef } from '../../../../../global/components/AlertDialog/types/AlertDialogRef'

export function usePrompt(initialTitle: string) {
  const [title, setTitle] = useState(initialTitle)
  const [value, setValue] = useState('')
  const alertDialogRef = useRef<AlertDialogRef | null>(null)

  function open() {
    alertDialogRef.current?.open()
  }

  function close() {
    alertDialogRef.current?.close()
  }

  return {
    title,
    value,
    alertDialogRef,
    setTitle,
    setValue,
    open,
    close,
    focus,
  }
}
