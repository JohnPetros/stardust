'use client'

import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'
import { motion, Variants } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { useCheckbox } from './useCheckbox'

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

type CheckboxProps = {
  children: string
  onCheck: () => void
  isChecked: boolean
}

export function Checkbox({ children, onCheck, isChecked }: CheckboxProps) {
  const { checkRef, color, handleKeydown } = useCheckbox(isChecked)

  return (
    <motion.label
      role="checkbox"
      aria-keyshortcuts="Space"
      htmlFor={children}
      onKeyDown={handleKeydown}
      variants={checkboxAnimations}
      whileHover="hover"
      whileTap="tap"
      className={twMerge(
        'flex w-full cursor-pointer items-center gap-3 rounded-md border border-gray-100 bg-purple-700 p-3',
        colors[color]
      )}
    >
      <C.Root
        ref={checkRef}
        id={children}
        className={twMerge(
          'h-6 w-6 rounded-md border border-gray-100 bg-transparent',
          colors[color]
        )}
        onCheckedChange={onCheck}
        tabIndex={-1}
      >
        <C.Indicator className="grid place-content-center">
          <motion.div
            variants={indicatorAnimations}
            initial="initial"
            animate="rotate"
          >
            <Check
              className={twMerge('text-lg text-blue-300', colors[color])}
              weight="bold"
            />
          </motion.div>
        </C.Indicator>
      </C.Root>
      <span className={twMerge('text-gray-100', color)}>{children}</span>
    </motion.label>
  )
}
