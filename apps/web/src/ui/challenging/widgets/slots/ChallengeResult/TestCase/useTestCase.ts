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

  console.log(inputs)
  console.log(expectedOutput)

  const translatedInputs = useMemo(() => {
    if (inputs.length > 0) {
      return inputs
        .map((input) => {
          return provider
            .translateToCodeRunner(JSON.stringify(input))
            .replaceAll('\n', '')
        })
        .join(',')
    }
    return 'sem entrada'
  }, [inputs, provider.translateToCodeRunner])

  const translatedExpectedOutput = useMemo(() => {
    return provider
      .translateToCodeRunner(JSON.stringify(expectedOutput))
      .replaceAll('\n', '')
  }, [expectedOutput, provider.translateToCodeRunner])

  return {
    isOpen,
    translatedInputs,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
