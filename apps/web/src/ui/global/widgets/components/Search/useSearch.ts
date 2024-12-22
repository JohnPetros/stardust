import { useState } from 'react'

import { useDebounce } from '@/ui/global/hooks'

export function useSearch(onSearchChange: (...args: unknown[]) => void) {
  const [value, setValue] = useState('')

  const deboucedChange = useDebounce(onSearchChange, 200)

  function handleValueChange(value: string) {
    setValue(value)
    deboucedChange(value)
  }

  return {
    value,
    handleValueChange,
  }
}
