'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PanInfo, useAnimation } from 'framer-motion'

import { ConsoleProps } from '.'

import { STORAGE } from '@/global/constants'
import { useLocalStorage } from '@/global/hooks/useLocalStorage'
import { useCode } from '@/services/code'

export function useConsole({ height, results }: ConsoleProps) {
  const controls = useAnimation()

  const [output, setOutput] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [shouldFormatOutput, setShouldFormatOutput] = useState(false)

  const code = useCode()

  const shouldFormatConsoleOutput = useLocalStorage<boolean>(
    STORAGE.keys.shouldFormatConsoleOutput
  )
  const shouldPrettify = shouldFormatConsoleOutput.get() ?? false

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

  function handleToggleFormatOutput() {
    localStorage.setItem(
      STORAGE.keys.shouldFormatConsoleOutput,
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

    const formattedOutput = code.formatOutput(results, shouldPrettify)

    setOutput(formattedOutput)
  }, [results])

  useEffect(() => {
    const shouldFormatConsoleOutput = Boolean(
      localStorage.getItem(STORAGE.keys.shouldFormatConsoleOutput) === 'true'
    )
    setShouldFormatOutput(shouldFormatConsoleOutput)
  }, [isOpen])

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
