'use client'

import { useEffect, useState } from 'react'

import { REGEX } from '@/utils/constants'

export function useTestCase(isLocked: boolean, userOutput: string) {
  const [isOpen, setIsOpen] = useState(false)

  function formatOutput(value: string | number | (string | number)[]) {
    if (Array.isArray(value)) {
      return '[' + value.join(',') + ']'
    }

    const regex = REGEX.insideQuotes
    return value.toString().replace(regex, '$2')
  }

  function handleButtonClick() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (userOutput && !isLocked) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked])

  return {
    isOpen,
    formatOutput,
    handleButtonClick,
  }
}
