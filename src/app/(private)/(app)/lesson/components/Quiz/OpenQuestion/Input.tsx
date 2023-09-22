'use client'

import { useLesson } from '@/hooks/useLesson'
import { InputHTMLAttributes, MutableRefObject, RefObject, useMemo } from 'react'
import { tv } from 'tailwind-variants'

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
  const {
    state: { isAnswerVerified, isAnswerCorrect },
  } = useLesson()

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
        className={'bg-green-900 outline-none px-3 py-2 w-full font-code'}
        maxLength={answer.length}
        {...rest}
      />
    </div>
  )
}
