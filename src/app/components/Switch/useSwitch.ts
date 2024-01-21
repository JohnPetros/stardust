'use client'

import { useState } from 'react'

export function useSwitch(onCheck: (isChecked: boolean) => void) {
  const [isChecked, setIsChecked] = useState(false)

  function handleCheckChange(isChecked: boolean) {
    setIsChecked(isChecked)
    onCheck(isChecked)
  }

  function handleLabelClick() {
    setIsChecked(!isChecked)
    onCheck(!isChecked)
  }

  return {
    isChecked,
    handleCheckChange,
    handleLabelClick,
  }
}
