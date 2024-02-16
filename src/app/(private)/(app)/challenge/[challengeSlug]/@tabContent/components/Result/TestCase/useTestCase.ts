'use client'

import { useEffect, useState } from 'react'

import { ChallengeTestCaseExpectedOutput } from '@/@types/Challenge'

export function useTestCase(
  isLocked: boolean,
  isCorrect: boolean,
  userOutput: string[]
) {
  const [isOpen, setIsOpen] = useState(false)

  function formatOutput(
    output: ChallengeTestCaseExpectedOutput
  ): ChallengeTestCaseExpectedOutput {
    if (Array.isArray(output)) {
      const formattedElements = output.map(formatOutput)
      return '[ ' + formattedElements.join(', ') + ' ]'
    }

    return output
  }

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
    formatOutput,
    handleButtonClick,
  }
}
