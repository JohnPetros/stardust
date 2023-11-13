'use client'

import { InputHTMLAttributes, useMemo } from 'react'
import { tv } from 'tailwind-variants'

import { useLessonStore } from '@/stores/lessonStore'

const inputStyles = tv({
  base: ' rounded-md border-2 overflow-hidden custom-outline',
  variants: {
    color: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-700 text-red-700',
      green: 'border-green-500 text-green-500',
    },
  },
})

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  answer: string
}

export function Input({ answer, ...rest }: InputProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )

  const width = 2 + answer.length + 'ch'

  const color = useMemo(() => {
    if (!isAnswerCorrect && isAnswerVerified) {
      return 'red'
    } else if (isAnswerCorrect && isAnswerVerified) {
      return 'green'
    } else {
      return 'gray'
    }
  }, [isAnswerCorrect, isAnswerVerified])

  return (
    <div style={{ width }} className={inputStyles({ color })}>
      <input
        className={'w-full bg-green-900 px-3 py-2 font-code outline-none'}
        maxLength={answer.length}
        {...rest}
      />
    </div>
  )
}
