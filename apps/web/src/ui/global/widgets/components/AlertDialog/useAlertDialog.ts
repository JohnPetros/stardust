'use client'

import { useEffect, useRef, useState } from 'react'

import type { AlertDialogType } from './types/AlertDialogType'
import { ALERT_DIALOG_EFFECTS } from './alert-dialog-effects'

import { playAudio } from '@/utils'

export function useAlertDialog(
  type: AlertDialogType,
  shouldPlayAudio: boolean,
  onOpenChange: ((isOpen: boolean) => void) | undefined,
) {
  const [isOpen, setIsOpen] = useState(false)

  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const dialogEffects = ALERT_DIALOG_EFFECTS.find(
    (animation) => animation.id === type.toLocaleLowerCase(),
  )

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function handleOpenChange(isOpen: boolean) {
    setIsOpen(isOpen)
    if (onOpenChange) onOpenChange(isOpen)
  }

  useEffect(() => {
    if (dialogEffects?.audioFile && isOpen && type !== 'generic' && shouldPlayAudio) {
      playAudio(dialogEffects.audioFile)
    }
  }, [isOpen, shouldPlayAudio, type, dialogEffects])

  useEffect(() => {
    containerRef.current = document.body
    setIsRendered(true)
  }, [])

  return {
    animation: dialogEffects?.animation ?? null,
    isRendered,
    containerRef,
    isOpen,
    handleOpenChange,
    setIsOpen,
    open,
    close,
  }
}
