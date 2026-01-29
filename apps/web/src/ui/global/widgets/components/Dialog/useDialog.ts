'use client'

import { useState } from 'react'

export function useDialog(
  shouldStartOpen: boolean,
  onOpenChange?: (isOpen: boolean) => void,
  openProp?: boolean,
) {
  const [internalIsOpen, setInternalIsOpen] = useState(shouldStartOpen)
  const isControlled = openProp !== undefined
  const isOpen = isControlled ? openProp : internalIsOpen

  function open() {
    if (!isControlled) setInternalIsOpen(true)
    onOpenChange?.(true)
  }

  function close() {
    if (!isControlled) setInternalIsOpen(false)
    onOpenChange?.(false)
  }

  function handleOpenChange(open: boolean) {
    if (!isControlled) setInternalIsOpen(open)
    onOpenChange?.(open)
  }

  return {
    isOpen,
    open,
    close,
    handleOpenChange,
  }
}
