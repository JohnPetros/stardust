'use client'

import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'

import { Variants, motion } from 'framer-motion'
interface CheckboxProps {
  children: string
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

export function Checkbox({ children }: CheckboxProps) {
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
        >
          <C.Indicator className="grid place-content-center">
            <motion.div
              variants={indicatorAnimations}
              initial="initial"
              animate="rotate"
            >
              <Check className="text-blue-300 text-lg" weight='bold' />
            </motion.div>
          </C.Indicator>
        </C.Root>
        <span className="text-gray-100">{children}</span>
      </label>
    </motion.li>
  )
}
