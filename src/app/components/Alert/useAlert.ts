'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertType } from '.'

import { ALERT_EFFECTS } from '@/utils/constants'
import { playAudio } from '@/utils/helpers'

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

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
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
