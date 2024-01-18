'use client'

import { useEffect, useRef, useState } from 'react'

import { AlertType } from '.'

import { ALERT_EFFECTS } from '@/utils/constants'
import { playSound } from '@/utils/helpers'

export function useAlert(
  type: AlertType,
  canPlaySong: boolean,
  onOpen: VoidFunction | null = null
) {
  const [isOpen, setIsOpen] = useState(false)

  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const { animation, sound } = ALERT_EFFECTS.find(
    (animation) => animation.id === type.toLocaleLowerCase()
  )!

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (sound && isOpen && type !== 'generic' && canPlaySong) {
      playSound(sound)
    }
  }, [isOpen, canPlaySong, type, sound])

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
