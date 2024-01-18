import { useEffect, useMemo, useRef, useState } from 'react'

import { AlertRef } from '../Alert'

export function usePrompt() {
  const [title, setTitle] = useState('')
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
