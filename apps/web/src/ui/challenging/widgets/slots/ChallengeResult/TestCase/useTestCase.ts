import { useEffect, useState } from 'react'

import type { LspProvider } from '@stardust/core/global/interfaces'

type Params = {
  isLocked: boolean
  isCorrect: boolean
  inputs: unknown[]
  userOutput: unknown | undefined
  expectedOutput: unknown
  lspProvider: LspProvider
}

export function useTestCase({
  isCorrect,
  isLocked,
  inputs,
  userOutput,
  expectedOutput,
  lspProvider,
}: Params) {
  const [isOpen, setIsOpen] = useState(false)
  const [translatedInputs, setTranslatedInputs] = useState('sem entrada')
  const [translatedUserOutput, setTranslatedUserOutput] = useState('')
  const [translatedExpectedOutput, setTranslatedExpectedOutput] = useState('')

  function handleButtonClick() {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (userOutput !== undefined && (!isLocked || isCorrect)) {
      setIsOpen(true)
    }
  }, [userOutput, isLocked, isCorrect])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!inputs?.length) {
        if (!cancelled) setTranslatedInputs('sem entrada')
        return
      }

      const values = await Promise.all(
        inputs.map(async (input) => {
          const translatedInput = await lspProvider.translateToLsp(input)
          return translatedInput.replaceAll('\n', '')
        }),
      )

      if (!cancelled) setTranslatedInputs(values.join(' '))
    }

    run()
    return () => {
      cancelled = true
    }
  }, [inputs, lspProvider])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (userOutput === undefined) {
        if (!cancelled) setTranslatedUserOutput('')
        return
      }

      const translation = await lspProvider.translateToLsp(userOutput)
      if (!cancelled) setTranslatedUserOutput(translation.replaceAll('\n', ''))
    }

    run()
    return () => {
      cancelled = true
    }
  }, [userOutput, lspProvider])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const translation = await lspProvider.translateToLsp(expectedOutput)
      if (!cancelled) setTranslatedExpectedOutput(translation.replaceAll('\n', ''))
    }

    run()
    return () => {
      cancelled = true
    }
  }, [expectedOutput, lspProvider])

  return {
    isOpen,
    translatedInputs,
    translatedUserOutput,
    translatedExpectedOutput,
    handleButtonClick,
  }
}
