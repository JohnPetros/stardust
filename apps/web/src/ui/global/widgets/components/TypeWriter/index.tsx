'use client'

import dynamic from 'next/dynamic'

import { useTypeWriter } from './useTypeWriter'

const TypewriterEffectDynamic = dynamic(() => import('typewriter-effect'), { ssr: false })

const SimpleTypewriterDynamic = dynamic(
  () => import('react-simple-typewriter').then((module) => module.Typewriter),
  { ssr: false },
)

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
    return <span dangerouslySetInnerHTML={{ __html: String(content) }} />
  }

  if (Array.isArray(content)) {
    return (
      <SimpleTypewriterDynamic
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
    <TypewriterEffectDynamic
      component={'span'}
      options={options}
      onInit={(typewriter) => {
        typewriter
          .callFunction(() => {
            const cursors = document.querySelectorAll('.Typewriter__cursor')
            cursors.forEach((cursor) => {
              cursor.remove()
            })
          })
          .typeString(formattedContent)
          .start()
      }}
    />
  )
}
