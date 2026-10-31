import { useRef, useState } from 'react'
import type { DialogRef } from '@/ui/shadcn/components/dialog'

export function usePrompt(initialTitle: string) {
  const [title, setTitle] = useState(initialTitle)
  const [value, setValue] = useState('')
  const dialogRef = useRef<DialogRef>(null)

  function open() {
    dialogRef.current?.open()
  }

  function close() {
    dialogRef.current?.close()
  }

  return {
    title,
    value,
    dialogRef,
    setTitle,
    setValue,
    open,
    close,
  }
}
