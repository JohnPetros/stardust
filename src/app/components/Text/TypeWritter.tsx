'use client'

import { useEffect, useRef, useState } from 'react'

interface TypeWritterProps {
  children: string
  canType?: boolean
  delay?: number
  speed?: number
}

export function TypeWritter({
  children,
  canType = true,
  delay = 0,
  speed = 25,
}: TypeWritterProps) {
  const [text, setText] = useState('')
  const index = useRef(0)
  const hasDelay = useRef(!!delay)
  const timer = useRef<NodeJS.Timeout | number>(0)

  async function delayAnimation() {
    return new Promise((resolve) => {
      setTimeout(() => {
        hasDelay.current = false
        resolve(true)
      }, delay)
    })
  }

  async function initAnimation() {
    if (text.length === children.length) {
      clearInterval(timer.current)
      return
    }

    if (hasDelay.current) {
      await delayAnimation()
    }

    timer.current = setTimeout(() => {
      setText(text + children.charAt(index.current))
      index.current += 1
    }, speed)
  }

  useEffect(() => {
    initAnimation()
    return () => clearInterval(timer.current)
  }, [index.current])

  if (!children) return null

  if (!canType) return children

  return text
}
