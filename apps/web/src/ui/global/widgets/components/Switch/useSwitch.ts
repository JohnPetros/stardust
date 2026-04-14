'use client'

import { useState } from 'react'
import { useEffect } from 'react'

export function useSwitch(defaultCheck: boolean, onCheck: (isChecked: boolean) => void) {
  const [isChecked, setIsChecked] = useState(defaultCheck)

  useEffect(() => {
    setIsChecked(defaultCheck)
  }, [defaultCheck])

  function handleCheckChange(isChecked: boolean) {
    setIsChecked(isChecked)
    onCheck(isChecked)
  }

  return {
    isChecked,
    handleCheckChange,
  }
}
