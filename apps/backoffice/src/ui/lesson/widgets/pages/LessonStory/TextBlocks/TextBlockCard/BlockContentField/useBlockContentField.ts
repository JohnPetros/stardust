import { useEffect, useRef, useState } from 'react'

import { useDebounce } from '@/ui/global/hooks/useDebounce'

type Params = {
  value: string
  onChange: (value: string) => void
}

export function useBlockContentField({ value, onChange }: Params) {
  const [localValue, setLocalValue] = useState(value)
  const debouncedLocalValue = useDebounce(localValue, 500)
  const lastEmittedValueRef = useRef(value)

  useEffect(() => {
    setLocalValue(value)
    lastEmittedValueRef.current = value
  }, [value])

  useEffect(() => {
    if (debouncedLocalValue === lastEmittedValueRef.current) return

    lastEmittedValueRef.current = debouncedLocalValue
    onChange(debouncedLocalValue)
  }, [debouncedLocalValue, onChange])

  return {
    localValue,
    setLocalValue,
  }
}
