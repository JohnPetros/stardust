'use client'
import { useEffect, useState } from 'react'
import { useAnimate } from 'framer-motion'

const TOAST_DURATION_DEFAULT = 2.5 // seconds

type Type = 'error' | 'success'

interface OpenToastProps {
  type: Type
  message: string
  seconds?: number
}

export interface ToastRef {
  open: ({ type, message, seconds }: OpenToastProps) => void
}

export function useToast() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<Type>('error')
  const [message, setMessage] = useState('')
  const [seconds, setSeconds] = useState(TOAST_DURATION_DEFAULT)
  const [scope, animate] = useAnimate()
  const [scrollPosition, setScrollPosition] = useState(0)

  function open({ type, message, seconds = 2.5 }: OpenToastProps) {
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
