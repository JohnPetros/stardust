'use client'

import { useLesson } from '@/hooks/useLesson'
import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

import { Variants, motion } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

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
    transition: {
      ease: 'linear',
      duration: 0.1,
    },
  },
}

interface CheckboxProps {
  children: string
  onCheck: () => void
  isChecked: boolean
}

export function Checkbox({ children, onCheck, isChecked }: CheckboxProps) {
  const {
    state: { isAnswerVerified, isAnswerCorrect },
  } = useLesson()

  function getColor() {
    if (isAnswerCorrect && isAnswerVerified && isChecked) {
      return 'green'
    } else if (isAnswerVerified && isChecked) {
      return 'red'
    } else if (isChecked) {
      return 'blue'
    } else {
      return 'gray'
    }
  }

  const color = colors[getColor()]

  return (
    <motion.li
      variants={checkboxAnimations}
      whileHover="hover"
      whileTap="tap"
      className={twMerge(
        'rounded-md border border-gray-100 bg-purple-700',
        color
      )}
    >
      <label
        htmlFor={children}
        className="flex items-center  p-3 w-full gap-3 cursor-pointer"
      >
        <C.Root
          id={children}
          className={twMerge(
            'rounded-md border border-gray-100 bg-transparent w-6 h-6',
            color
          )}
          onCheckedChange={onCheck}
        >
          <C.Indicator className="grid place-content-center">
            <motion.div
              variants={indicatorAnimations}
              initial="initial"
              animate="rotate"
            >
              <Check
                className={twMerge('text-blue-300 text-lg', color)}
                weight="bold"
              />
            </motion.div>
          </C.Indicator>
        </C.Root>
        <span className={twMerge('text-gray-100', color)}>{children}</span>
      </label>
    </motion.li>
  )
}
