'use client'

import { useEffect, useState } from 'react'

import type { ChallengeTestCaseExpectedOutput } from '@/@types/Challenge'

export function useTestCase(
  isLocked: boolean,
  isCorrect: boolean,
  userOutput: ChallengeTestCaseExpectedOutput | null
) {
  const [isOpen, setIsOpen] = useState(false)

  function handleButtonClick() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (userOutput && (!isLocked || isCorrect)) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked, isCorrect])

  return {
    isOpen,
    handleButtonClick,
  }
}
