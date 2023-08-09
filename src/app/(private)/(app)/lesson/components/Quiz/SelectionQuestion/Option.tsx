'use client'

import { useId } from 'react'

import { tv } from 'tailwind-variants'
import * as RadioGroup from '@radix-ui/react-radio-group'

const optionStyles = tv({
  base: 'rounded-md bg-purple-700 border-2 text-medium h-12 w-full flex items-center justify-center cursor-pointer',
  variants: {
    color: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-300 text-red-300',
      green: 'border-green-500 text-green-500',
      blue: 'border-blue-300 text-blue-300',
    },
  },
})

interface OptionProps {
  label: string
  onClick: () => void
  isSelected: boolean
  isAnswerWrong: boolean
  isAnswerCorrect: boolean
}

export function Option({
  label,
  onClick,
  isAnswerWrong,
  isAnswerCorrect,
  isSelected,
}: OptionProps) {
  const id = useId()

  function getColor() {
    if (isAnswerWrong && isSelected) {
      return 'red'
    } else if (isAnswerCorrect) {
      return 'green'
    } else if (isSelected) {
      return 'blue'
    } else {
      return 'gray'
    }
  }

  return (
    <RadioGroup.Item id={id} value={label} asChild>
      <label
        htmlFor={id}
        onClick={onClick}
        className={optionStyles({ color: getColor() })}
      >
        {label}
      </label>
    </RadioGroup.Item>
  )
}
