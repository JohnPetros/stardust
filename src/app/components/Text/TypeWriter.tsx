'use client'

import Typewriter from 'typewriter-effect'

interface TypeWriterProps {
  text: string
  isEnable?: boolean
}

export function TypeWriter({ text, isEnable = true }: TypeWriterProps) {
  if (isEnable)
    return (
      <Typewriter
        options={{
          delay: 20,
          skipAddStyles: true,
        }}
        onInit={(typewriter) => {
          typewriter
            .callFunction(() => {
              const cursors = document.querySelectorAll('.Typewriter__cursor')
              cursors.forEach((cursor) => cursor.remove())
            })
            .typeString(text)
            .start()
        }}
      />
    )

  return text
}
