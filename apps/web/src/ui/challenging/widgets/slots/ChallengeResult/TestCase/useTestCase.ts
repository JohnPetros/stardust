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
  const codeRunner = useCodeRunner()

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
          return codeRunner.translateToCodeRunner(input).replaceAll('\n', '')
        })
        .join(',')
    }
    return 'sem entrada'
  }, [inputs, codeRunner.translateToCodeRunner])

  const translatedUserOutput = useMemo(() => {
    return codeRunner.translateToCodeRunner(userOutput)
  }, [userOutput, codeRunner.translateToCodeRunner])

  const translatedExpectedOutput = useMemo(() => {
    return codeRunner.translateToCodeRunner(expectedOutput).replaceAll('\n', '')
  }, [expectedOutput, codeRunner.translateToCodeRunner])

  return {
    isOpen,
    translatedInputs,
    translatedUserOutput,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
