'use client'

import { useState } from 'react'

export function useSwitch(
  defaultCheck: boolean,
  onCheck: (isChecked: boolean) => void
) {
  const [isChecked, setIsChecked] = useState(defaultCheck)

  function handleCheckChange(isChecked: boolean) {
    setIsChecked(isChecked)
    onCheck(isChecked)
  }

  return {
    isChecked,
    handleCheckChange,
  }
}
