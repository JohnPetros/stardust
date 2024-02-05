'use client'

import { useCallback, useState } from 'react'

export default function useToggle(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue)

  const toggle = useCallback(() => {
    setValue((value) => !value)
  }, [])

  return [value, toggle]
}
