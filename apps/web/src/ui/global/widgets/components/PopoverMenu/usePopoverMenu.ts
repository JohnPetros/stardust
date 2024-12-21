'use client'

import { useState } from 'react'
import type { PopoverMenuButton } from './types'

export function usePopoverMenu(onOpenChange?: (isOpen: boolean) => void) {
  const [isOpen, setIsOpen] = useState(false)

  function close() {
    setIsOpen(false)
    if (onOpenChange) onOpenChange(false)
  }

  function handleOpenChange(isMenuOpen: boolean) {
    setIsOpen(isMenuOpen)
    if (onOpenChange) onOpenChange(isMenuOpen)
  }

  function handleButtonClick({ action }: Pick<PopoverMenuButton, 'action'>) {
    close()
    action()
  }

  return {
    isOpen,
    handleOpenChange,
    handleButtonClick,
  }
}
