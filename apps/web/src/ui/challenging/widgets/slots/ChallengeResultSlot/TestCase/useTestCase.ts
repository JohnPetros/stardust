'use client'

import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import { useEffect, useMemo, useState } from 'react'

type UseTestCaseProps = {
  isLocked: boolean
  isCorrect: boolean
  inputs: unknown[]
  userOutput: unknown | undefined
  expectedOutput: unknown
}

export function useTestCase({
  isCorrect,
  isLocked,
  inputs,
  userOutput,
  expectedOutput,
}: UseTestCaseProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { provider } = useCodeRunner()

  function handleButtonClick() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (userOutput && (!isLocked || isCorrect)) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked, isCorrect])

  const translatedInputs = useMemo(() => {
    if (inputs.length > 0) {
      return inputs.map(provider.translateToCodeRunner).join(', ')
    }
    return 'sem entrada'
  }, [inputs, provider.translateToCodeRunner])

  const translatedUserOutput = useMemo(() => {
    if (userOutput !== undefined) {
      return provider.translateToCodeRunner(userOutput)
    }

    return 'sem resultado'
  }, [userOutput, provider.translateToCodeRunner])

  const translatedExpectedOutput = useMemo(() => {
    return provider.translateToCodeRunner(expectedOutput)
  }, [expectedOutput, provider.translateToCodeRunner])

  return {
    isOpen,
    translatedInputs,
    translatedUserOutput,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
