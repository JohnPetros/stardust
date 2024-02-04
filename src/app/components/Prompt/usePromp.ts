import { useEffect, useMemo, useRef, useState } from 'react'

import { AlertRef } from '../Alert'

export function usePrompt(initialTitle: string) {
  const [title, setTitle] = useState(initialTitle)
  const [value, setValue] = useState('')
  const alertRef = useRef<AlertRef | null>(null)

  function open() {
    alertRef.current?.open()
  }

  function close() {
    alertRef.current?.close()
  }

  return {
    title,
    value,
    alertRef,
    setTitle,
    setValue,
    open,
    close,
    focus,
  }
}
