'use client'

import { useEffect } from 'react'
import { useState } from 'react'

export function useRangeInput(value: number, onValueChange: (value: number) => void) {
  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  function handleValueChange([value]: number[]) {
    if (value === undefined) return

    setCurrentValue(value)
  }

  function handleValueCommit([value]: number[]) {
    if (value === undefined) return

    onValueChange(value)
  }

  return {
    currentValue,
    handleValueChange,
    handleValueCommit,
  }
}
