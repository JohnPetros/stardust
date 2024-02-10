'use client'
import { useEffect, useState } from 'react'
import { useAnimate } from 'framer-motion'

import { OpenToastParams } from '@/contexts/ToastContext/types/OpenToastParams'
import { ToastType } from '@/contexts/ToastContext/types/ToastType'

const TOAST_DURATION_DEFAULT = 2.5 // seconds

export function useToast() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<ToastType>('error')
  const [message, setMessage] = useState('')
  const [seconds, setSeconds] = useState(TOAST_DURATION_DEFAULT)
  const [scope, animate] = useAnimate()
  const [scrollPosition, setScrollPosition] = useState(0)

  function open({ type, message, seconds = 2.5 }: OpenToastParams) {
    setType(type)
    setMessage(message)
    setSeconds(seconds)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  function handleDragEnd() {
    animate(scope.current, { x: 500 }, { duration: 0.1 })
    close()
  }

  useEffect(() => {
    if (!isOpen || !seconds) return

    const timer = setTimeout(() => {
      close()
    }, seconds * 1000)

    return () => clearTimeout(timer)
  }, [isOpen, seconds])

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) window.scrollTo(0, scrollPosition)
  }, [isOpen])

  return {
    isOpen,
    type,
    message,
    seconds,
    scope,
    open,
    close,
    handleDragEnd,
  }
}
