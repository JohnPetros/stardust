import { useState } from 'react'

import { useDebounce } from '@/global/hooks/useDebounce'

export function useSearch(onSearchChange: (...args: unknown[]) => void) {
  const [value, setValue] = useState('')
  const debouceChange = useDebounce(onSearchChange, 450)

  function handleValueChange(value: string) {
    setValue(value)
    debouceChange(value)
  }

  return {
    value,
    handleValueChange,
  }
}
