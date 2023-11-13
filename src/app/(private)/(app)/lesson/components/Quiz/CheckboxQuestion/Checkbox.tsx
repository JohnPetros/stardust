'use client'

import { KeyboardEvent, useRef } from 'react'
import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'
import { motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { useLessonStore } from '@/stores/lessonStore'

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
  children: string
  onCheck: () => void
  isChecked: boolean
}

export function Checkbox({ children, onCheck, isChecked }: CheckboxProps) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )
  const checkRef = useRef<HTMLButtonElement>(null)

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

  function handleKeydown({ key }: KeyboardEvent) {
    if (key === ' ') {
      checkRef.current?.click()
    }
  }

  return (
    <motion.label
      htmlFor={children}
      onKeyDown={handleKeydown}
      variants={checkboxAnimations}
      whileHover="hover"
      whileTap="tap"
      className={twMerge(
        'flex w-full cursor-pointer items-center gap-3 rounded-md border border-gray-100 bg-purple-700 p-3',
        color
      )}
    >
      <C.Root
        ref={checkRef}
        id={children}
        className={twMerge(
          'h-6 w-6 rounded-md border border-gray-100 bg-transparent',
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
              className={twMerge('text-lg text-blue-300', color)}
              weight="bold"
            />
          </motion.div>
        </C.Indicator>
      </C.Root>
      <span className={twMerge('text-gray-100', color)}>{children}</span>
    </motion.label>
  )
}
