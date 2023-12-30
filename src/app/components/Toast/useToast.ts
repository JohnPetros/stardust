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

  function open({ type, message, seconds = 2.5 }: OpenToastProps) {
    setType(type)
    setMessage(message)
    setSeconds(seconds)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen || !seconds) return

    const timer = setTimeout(() => {
      close()
    }, seconds * 1000)

    return () => clearTimeout(timer)
  }, [isOpen, seconds])

  return {
    isOpen,
    type,
    message,
    seconds,
    scope,
    animate,
    open,
    close,
  }
}
