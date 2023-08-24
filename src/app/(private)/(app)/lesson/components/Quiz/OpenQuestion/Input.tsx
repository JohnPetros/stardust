'use client'

import { InputHTMLAttributes, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
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
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
}

export function Input({ isAnswerCorrect, isAnswerVerified, ...rest }: InputProps) {

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
    <div className={inputStyles({ color })}>
      <input className="bg-green-900 outline-none p-3" {...rest} />
    </div>
  )
}
