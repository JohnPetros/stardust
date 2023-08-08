'use client'

import { useEffect, useRef, useState } from 'react'

interface TypeWritterProps {
  children: string
  canType: boolean
}

export function TypeWritter({ children, canType }: TypeWritterProps) {
  if (!children) return null

  const [text, setText] = useState('')
  const index = useRef(0)
  const timer = useRef<NodeJS.Timeout | number>(0)

  useEffect(() => {
    if (text.length === children.length) {
      clearInterval(timer.current)
      return
    }

    timer.current = setTimeout(() => {
      setText(text + children.charAt(index.current))
      index.current += 1
    }, 20)

    return () => clearInterval(timer.current)
  }, [index.current])

  return text
}
