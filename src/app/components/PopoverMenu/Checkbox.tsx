'use client'

import * as C from '@radix-ui/react-checkbox'

import { Variants, motion } from 'framer-motion'
import { Check } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

const indicatorAnimation: Variants = {
  initial: {
    rotate: 90,
  },
  rotate: {
    rotate: 0,
  },
}

interface CheckboxProps {
  isChecked: boolean
}

export function Checkbox({ isChecked }: CheckboxProps) {
  return (
    <C.Root
      className={twMerge(
        'rounded-md border-1 border-green-400 w-6 h-6 ml-auto',
        isChecked ? 'bg-green-400' : ' bg-transparent'
      )}
      checked={isChecked}
    >
      <C.Indicator className="grid place-content-center">
        <motion.div
          variants={indicatorAnimation}
          initial="initial"
          animate="rotate"
        >
          <Check className={'text-green-900 text-lg'} weight="bold" />
        </motion.div>
      </C.Indicator>
    </C.Root>
  )
}
