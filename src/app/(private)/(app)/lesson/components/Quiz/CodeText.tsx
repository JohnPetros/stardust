'use client'

import { useEffect, useState } from 'react'

import { DELEGUA_TOKENS, THEMES } from '@/utils/constants'

interface CodeTextProps {
  children: string
}

export function CodeText({ children }: CodeTextProps) {
  const [color, setColor] = useState('')

  function getToken() {
    for (const token of Object.keys(DELEGUA_TOKENS)) {
      if (DELEGUA_TOKENS[token].includes(children)) {
        return token
      }
    }
  }

  useEffect(() => {
    const token = getToken()

    if (token) {
      const color = THEMES.default[token]

      setColor(color)
    }
  }, [])

  return <span style={{ color: color ? color : '#EBEBEB' }}>{children}</span>
}
