'use client'

import { useState } from 'react'

export function useRangeInput(value: number, onValueChange: (value: number) => void) {
  const [currentValue, setCurrentValue] = useState(value)

  function handleValueChange([value]: number[]) {
    if (value) setCurrentValue(value)
  }

  function handleValueCommit([value]: number[]) {
    if (value) onValueChange(value)
  }

  return {
    currentValue,
    handleValueChange,
    handleValueCommit,
  }
}
