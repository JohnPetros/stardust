'use client'

import { useEffect, useRef, useState } from 'react'

interface TypeWritterProps {
  children: string
}

export function TypeWritter({ children }: TypeWritterProps) {
  const [text, setText] = useState('')
  const index = useRef(0)

  useEffect(() => {
    console.log(text)

    if (text.length === children.length) return

    const timer = setTimeout(() => {
      setText(text + children.charAt(index.current))
      index.current += 1
    }, 20)

    return () => clearInterval(timer)
  }, [index.current])

  return text
}
