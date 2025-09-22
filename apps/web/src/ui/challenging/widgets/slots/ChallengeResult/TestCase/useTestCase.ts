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
  const { codeRunnerProvider } = useCodeRunner()

  function handleButtonClick() {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (userOutput !== undefined && (!isLocked || isCorrect)) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked, isCorrect])

  const translatedInputs = useMemo(() => {
    if (inputs.length > 0) {
      return inputs
        .map((input) => {
          return codeRunnerProvider.translateToCodeRunner(input).replaceAll('\n', '')
        })
        .join(',')
    }
    return 'sem entrada'
  }, [inputs, codeRunnerProvider.translateToCodeRunner])

  const translatedUserOutput = useMemo(() => {
    return codeRunnerProvider.translateToCodeRunner(userOutput)
  }, [userOutput, codeRunnerProvider.translateToCodeRunner])

  const translatedExpectedOutput = useMemo(() => {
    return codeRunnerProvider.translateToCodeRunner(expectedOutput).replaceAll('\n', '')
  }, [expectedOutput, codeRunnerProvider.translateToCodeRunner])

  return {
    isOpen,
    translatedInputs,
    translatedUserOutput,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
