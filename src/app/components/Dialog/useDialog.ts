'use client'

import { useState } from 'react'

export function useDialog(
  shouldStartOpen: boolean,
  onOpenChange?: (isOpen: boolean) => void
) {
  const [isOpen, setIsOpen] = useState(shouldStartOpen)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function handleOpenChange(isOpen: boolean) {
    if (onOpenChange) onOpenChange(isOpen)

    setIsOpen(isOpen)
  }

  return {
    isOpen,
    open,
    close,
    handleOpenChange,
  }
}
