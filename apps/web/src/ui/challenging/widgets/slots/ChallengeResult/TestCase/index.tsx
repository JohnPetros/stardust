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
  const { isOpen, translatedInputs, translatedExpectedOutput, handleButtonClick } =
    useTestCase({
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
      userOutput={userOutput}
      isOpen={isOpen}
      translatedInputs={translatedInputs}
      translatedExpectedOutput={translatedExpectedOutput}
      handleButtonClick={handleButtonClick}
    />
  )
}
