'use client'

import { useLesson } from '@/hooks/useLesson'
import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

import { Variants, motion } from 'framer-motion'
import { tv } from 'tailwind-variants'
interface CheckboxProps {
  children: string
}

const checkboxStyles = tv({
  base: 'rounded-md border border-gray-100 bg-purple-700',
  variants: {
    color: {
      gray: 'border-gray-100',
      red: 'border-red-700',
      green: 'border-green-500',
      blue: 'border-blue-300 ',
    },
  },
})

const colors = {
  gray: 'border-gray-100 text-gray-100',
  red: 'border-red-700 text-red-700',
  green: 'border-green-500 text-green-500',
  blue: 'border-blue-300 text-blue-300',
}

const checkboxAnimations: Variants = {
  hover: {
    scale: 1.02,
  },
  tap: {
    scale: 0.99,
  },
}

const indicatorAnimations: Variants = {
  initial: {
    rotate: 90,
  },
  rotate: {
    rotate: 0,
  },
}

interface CheckboxProps {
  onCheck: () => void
  isChecked: boolean
}

export function Checkbox({ children, onCheck, isChecked }: CheckboxProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
  } = useLesson()

  
  function getColor() {
    if (isAnswerCorrect && isAnswerVerified) {
      return 'green'
    } else if (isAnswerVerified) {
      return 'red'
    } else if (isChecked) {
      return 'blue'
    } else {
      return 'gray'
    }
  }

  return (
    <motion.li
      variants={checkboxAnimations}
      whileHover="hover"
      whileTap="tap"
      className="rounded-md border border-gray-100 bg-purple-700"
    >
      <label
        htmlFor={children}
        className="flex items-center  p-3 w-full gap-3 cursor-pointer"
      >
        <C.Root
          id={children}
          className="rounded-md border border-gray-100 bg-transparent w-6 h-6"
          onCheckedChange={onCheck}
        >
          <C.Indicator className="grid place-content-center">
            <motion.div
              variants={indicatorAnimations}
              initial="initial"
              animate="rotate"
            >
              <Check className="text-blue-300 text-lg" weight="bold" />
            </motion.div>
          </C.Indicator>
        </C.Root>
        <span className="text-gray-100">{children}</span>
      </label>
    </motion.li>
  )
}
