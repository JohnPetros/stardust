import { useEffect, useMemo, useState } from 'react'

import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'

type Params = {
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
}: Params) {
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
      return inputs
        .map((input) => {
          return provider.translateToCodeRunner(input).replaceAll('\n', '')
        })
        .join(',')
    }
    return 'sem entrada'
  }, [inputs, provider.translateToCodeRunner])

  const translatedExpectedOutput = useMemo(() => {
    return provider.translateToCodeRunner(expectedOutput).replaceAll('\n', '')
  }, [expectedOutput, provider.translateToCodeRunner])

  return {
    isOpen,
    translatedInputs,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
