'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertType } from '.'

import { useAudio } from '@/hooks/useAudio'
import { ALERT_EFFECTS } from '@/utils/constants'

export function useAlert(
  type: AlertType,
  canPlaySong: boolean,
  onOpen: VoidFunction | null = null
) {
  const [isOpen, setIsOpen] = useState(false)

  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const { animation, audioFile } = ALERT_EFFECTS.find(
    (animation) => animation.id === type.toLocaleLowerCase()
  )!

  const audio = useAudio(audioFile)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (audio && isOpen && type !== 'generic' && canPlaySong) {
      audio.play()
    }
  }, [isOpen, canPlaySong, type, audio])

  useEffect(() => {
    containerRef.current = document.body
    setIsRendered(true)
  }, [])

  useEffect(() => {
    if (onOpen && isOpen) onOpen()
  }, [isOpen, onOpen])

  return {
    animation,
    isRendered,
    containerRef,
    isOpen,
    setIsOpen,
    open,
    close,
  }
}
