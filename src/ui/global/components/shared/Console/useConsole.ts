'use client'

import { useState } from 'react'

export function useConsole(height: number) {
  const [isOpen, setIsOpen] = useState(false)

  function calculatePanelHeight() {
    return `${((height + 100) / 10) * 0.5}rem`
  }

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return {
    isOpen,
    open,
    close,
    panelHeight: calculatePanelHeight(),
  }
}
