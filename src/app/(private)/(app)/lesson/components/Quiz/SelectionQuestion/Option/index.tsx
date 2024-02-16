'use client'

import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion, Variants } from 'framer-motion'
import { tv } from 'tailwind-variants'

import { useOption } from './useOption'

const optionAnimations: Variants = {
  hover: {
    scale: 1.02,
  },
  tap: {
    scale: 0.99,
  },
}

const optionStyles = tv({
  base: 'rounded-md bg-purple-700 border-2 text-medium h-12 p-3 flex items-center justify-center cursor-pointer custom-outline hover:scale',
  variants: {
    color: {
      gray: 'border-gray-100 text-gray-100',
      red: 'border-red-700 text-red-700',
      green: 'border-green-500 text-green-500',
      blue: 'border-blue-300 text-blue-300',
    },
  },
})

export type OptionProps = {
  label: string
  onClick: () => void
  isSelected: boolean
  isAnswerIncorrect: boolean
  isAnswerCorrect: boolean
  hasAutoFocus?: boolean
}

export function Option({
  label,
  onClick,
  isAnswerIncorrect,
  isAnswerCorrect,
  isSelected,
  hasAutoFocus = false,
}: OptionProps) {
  const { id, color } = useOption({
    isAnswerIncorrect,
    isAnswerCorrect,
    isSelected,
  })

  return (
    <RadioGroup.Item id={id} value={label} asChild>
      <motion.label
        variants={optionAnimations}
        whileHover="hover"
        whileTap="tap"
        htmlFor={id}
        onClick={onClick}
        onFocus={onClick}
        autoFocus={hasAutoFocus}
        className={optionStyles({ color })}
      >
        {label}
      </motion.label>
    </RadioGroup.Item>
  )
}
