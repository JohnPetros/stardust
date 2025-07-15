'use client'

import { motion, type Variants } from 'motion/react'
import { tv } from 'tailwind-variants'

import type { LabelColor } from '../LabelColor'

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
  children: string
  id: string
  onClick: VoidFunction
  hasAutoFocus: boolean
  color: LabelColor
}

export function AnimatedLabel({
  children,
  id,
  color,
  hasAutoFocus,
  onClick,
}: OptionProps) {
  return (
    <motion.label
      htmlFor={id}
      variants={optionAnimations}
      whileHover='hover'
      whileTap='tap'
      onClick={onClick}
      onFocus={onClick}
      autoFocus={hasAutoFocus}
      className={optionStyles({ color })}
    >
      {children}
    </motion.label>
  )
}
