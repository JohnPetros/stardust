'use client'

import Typewriter from 'typewriter-effect'

import { useTypeWriter } from './useTypeWriter'

export type TypeWriterProps = {
  text: string
  isEnable?: boolean
  delay?: number
  deleteDelay?: number
  hasLoop?: boolean
  onDeleteChar?: VoidFunction
}

export function TypeWriter({
  text,
  isEnable = true,
  delay = 20,
  deleteDelay = 40,
  hasLoop = false,
  onDeleteChar,
}: TypeWriterProps) {
  const { options, formattedText } = useTypeWriter({
    text,
    delay,
    deleteDelay,
    hasLoop,
    onDeleteChar,
  })

  if (isEnable)
    return (
      <Typewriter
        component={'span'}
        options={options}
        onInit={(typewriter) => {
          typewriter
            .callFunction(() => {
              const cursors = document.querySelectorAll('.Typewriter__cursor')
              cursors.forEach((cursor) => cursor.remove())
            })
            .typeString(formattedText)
            .start()
        }}
      />
    )

  return <span dangerouslySetInnerHTML={{ __html: text }} />
}
