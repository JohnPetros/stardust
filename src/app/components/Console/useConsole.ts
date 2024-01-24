'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PanInfo, useAnimation } from 'framer-motion'

import { ConsoleProps } from '.'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE } from '@/utils/constants'

export function useConsole({ height, results }: ConsoleProps) {
  const storage = useLocalStorage()
  const controls = useAnimation()

  const shouldFormatConsoleOutput = Boolean(
    storage.getItem(STORAGE.shouldFormatConsoleOutput) === 'true'
  )

  const [output, setOutput] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [shouldFormatOutput, setShouldFormatOutput] = useState(
    shouldFormatConsoleOutput
  )

  const outputTypes = useRef<string[]>([])

  function calculateMinHeight() {
    return ((height + 100) / 10) * 0.5 + 'rem'
  }

  const open = useCallback(() => {
    setIsOpen(true)
    controls.start('open')
  }, [controls])

  const close = useCallback(() => {
    setIsOpen(false)
    controls.start('closed')
  }, [controls])

  const formatOutput = useCallback(
    (output: string, index: number) => {
      if (!shouldFormatOutput) return output

      const outputType = outputTypes.current[index].trim()

      switch (outputType) {
        case 'texto':
          return '"' + output + '"'
        case 'vetor':
          return '[ ' + output.split(',').join(', ') + ' ]'
        case 'number':
          return `<span className="number">${output}</span>`
        default:
          return output
      }
    },
    [shouldFormatOutput]
  )

  function handleToggleFormatOutput() {
    storage.setItem(
      STORAGE.shouldFormatConsoleOutput,
      String(!shouldFormatOutput)
    )
    setShouldFormatOutput(!shouldFormatOutput)
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.velocity.y > 20 && info.offset.y >= 50) {
      close()
    }
  }

  useEffect(() => {
    setOutput([])
    if (!results.length) return

    outputTypes.current = results.filter((_, index) => index % 2 === 0)
    const output = results.filter((_, index) => index % 2 !== 0)

    const formattedOutput = output.map((output, index) =>
      formatOutput(output.trim(), index)
    )

    setOutput(formattedOutput)
  }, [results, formatOutput])

  return {
    isOpen,
    output,
    animationControls: controls,
    shouldFormatOutput,
    open,
    close,
    calculateMinHeight,
    handleDragEnd,
    handleToggleFormatOutput,
  }
}
