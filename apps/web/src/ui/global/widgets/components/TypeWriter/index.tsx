'use client'

import TypewriterEffect from 'typewriter-effect'
import { Typewriter as SimpleTypewriter } from 'react-simple-typewriter'

import { useTypeWriter } from './useTypeWriter'

export type TypeWriterProps = {
  content: string | string[]
  isEnable?: boolean
  delay?: number
  deleteDelay?: number
  hasLoop?: boolean
  onTypeChar?: VoidFunction
  onDeleteChar?: VoidFunction
}

export function TypeWriter({
  content,
  isEnable = true,
  delay = 20,
  deleteDelay = 40,
  hasLoop = false,
  onTypeChar,
  onDeleteChar,
}: TypeWriterProps) {
  const { options, formattedContent } = useTypeWriter({
    content,
    delay,
    deleteDelay,
    hasLoop,
    onTypeChar,
    onDeleteChar,
  })

  if (!isEnable) {
    return <span dangerouslySetInnerHTML={{ __html: content }} />
  }

  if (Array.isArray(content)) {
    return (
      <SimpleTypewriter
        words={content}
        loop={hasLoop ? false : 1}
        cursor
        cursorStyle='|'
        typeSpeed={70}
        deleteSpeed={deleteDelay}
        delaySpeed={delay}
      />
    )
  }

  return (
    <TypewriterEffect
      component={'span'}
      options={options}
      onInit={(typewriter) => {
        typewriter
          .callFunction(() => {
            const cursors = document.querySelectorAll('.Typewriter__cursor')
            cursors.forEach((cursor) => cursor.remove())
          })
          .typeString(formattedContent)
          .start()
      }}
    />
  )
}
