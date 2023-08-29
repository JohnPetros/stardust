'use client'

import { DELEGUA_TOKENS, THEMES } from '@/utils/constants'

interface CodeTextProps {
  children: string
}

export function CodeText({ children }: CodeTextProps) {
  function getColor(word: string) {
    for (const token of Object.keys(DELEGUA_TOKENS)) {
      if (DELEGUA_TOKENS[token].includes(word)) {
        return THEMES.default[token]
      }
    }
  }

  return (
    <div className="space-x-2">
      {children.split(' ').map((word, index) => {
        const color = getColor(word)
        return (
          <span
            key={`${word}-${index}`}
            style={{ color: color ? color : '#EBEBEB' }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}
