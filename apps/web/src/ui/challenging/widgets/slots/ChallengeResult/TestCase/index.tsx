'use client'

import { useTestCase } from './useTestCase'
import { TestCaseView } from './TestCaseView'

type Props = {
  position: number
  inputs: unknown[]
  expectedOutput: unknown
  isLocked: boolean
  isCorrect: boolean
  userOutput: unknown | null
}

export const TestCase = ({
  position,
  isLocked,
  inputs,
  expectedOutput,
  isCorrect,
  userOutput,
}: Props) => {
  const {
    isOpen,
    translatedInputs,
    translatedExpectedOutput,
    translatedUserOutput,
    handleButtonClick,
  } = useTestCase({
    inputs,
    isLocked,
    isCorrect,
    userOutput,
    expectedOutput,
  })

  return (
    <TestCaseView
      position={position}
      isLocked={isLocked}
      isCorrect={isCorrect}
      isOpen={isOpen}
      translatedInputs={translatedInputs}
      userOutput={translatedUserOutput}
      translatedExpectedOutput={translatedExpectedOutput}
      handleButtonClick={handleButtonClick}
    />
  )
}
