'use client'

import Typewriter from 'typewriter-effect'

interface TypeWriterProps {
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
  function handleDeleteChar() {
    if (onDeleteChar && hasLoop) {
      onDeleteChar()
    }
  }

  if (isEnable)
    return (
      <Typewriter
        component={'span'}
        options={{
          delay,
          deleteSpeed: deleteDelay,
          skipAddStyles: true,
          loop: hasLoop,
          onRemoveNode: () => handleDeleteChar(),
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

  return <span dangerouslySetInnerHTML={{ __html: text }} />
}
