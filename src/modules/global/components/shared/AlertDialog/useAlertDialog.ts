'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertDialogType } from './types/AlertDialogType'
import { ALERT_DIALOG_EFFECTS } from './alert-dialog-effects'

import { playAudio } from '@/modules/global/utils'

export function useAlertDialog(
  type: AlertDialogType,
  shouldPlayAudio: boolean,
  onOpenChange: ((isOpen: boolean) => void) | undefined
) {
  const [isOpen, setIsOpen] = useState(false)

  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const { animation, audioFile } = ALERT_DIALOG_EFFECTS.find(
    (animation) => animation.id === type.toLocaleLowerCase()
  )!

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
    if (audioFile && isOpen && type !== 'generic' && shouldPlayAudio) {
      playAudio(audioFile)
    }
  }, [isOpen, shouldPlayAudio, type, audioFile])

  useEffect(() => {
    containerRef.current = document.body
    setIsRendered(true)
  }, [])

  return {
    animation,
    isRendered,
    containerRef,
    isOpen,
    handleOpenChange,
    setIsOpen,
    open,
    close,
  }
}
