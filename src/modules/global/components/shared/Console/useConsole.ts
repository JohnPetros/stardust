'use client'

import { PanInfo, useAnimation } from 'framer-motion'
import { useCallback, useState } from 'react'

import { STORAGE } from '@/global/constants'

export function useConsole(height: number) {
  const controls = useAnimation()

  const [isOpen, setIsOpen] = useState(false)
  const [shouldFormatOutput, setShouldFormatOutput] = useState(false)

  function calculateMinHeight() {
    return `${((height + 100) / 10) * 0.5}rem`
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

  return {
    isOpen,
    animationControls: controls,
    shouldFormatOutput,
    open,
    close,
    calculateMinHeight,
    handleDragEnd,
    handleToggleFormatOutput,
  }
}
