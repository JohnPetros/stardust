import { useEffect, useMemo, useState } from 'react'

import { useLsp } from '@/ui/global/hooks/useLsp'

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
  const { lspProvider } = useLsp()

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
          return lspProvider.translateToLsp(input).replaceAll('\n', '')
        })
        .join(',')
    }
    return 'sem entrada'
  }, [inputs, lspProvider.translateToLsp])

  const translatedUserOutput = useMemo(() => {
    return lspProvider.translateToLsp(userOutput)
  }, [userOutput, lspProvider.translateToLsp])

  const translatedExpectedOutput = useMemo(() => {
    return lspProvider.translateToLsp(expectedOutput).replaceAll('\n', '')
  }, [expectedOutput, lspProvider.translateToLsp])

  return {
    isOpen,
    translatedInputs,
    translatedUserOutput,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
