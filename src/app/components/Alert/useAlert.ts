'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertType } from '.'

import { ALERT_EFFECTS } from '@/utils/constants'
import { playAudio } from '@/utils/helpers'

export function useAlert(
  type: AlertType,
  canPlaySong: boolean,
  onOpenChange: ((isOpen: boolean) => void) | undefined
) {
  const [isOpen, setIsOpen] = useState(false)

  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const { animation, audioFile } = ALERT_EFFECTS.find(
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
    if (audioFile && isOpen && type !== 'generic' && canPlaySong) {
      playAudio(audioFile)
    }
  }, [isOpen, canPlaySong, type, audioFile])

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
