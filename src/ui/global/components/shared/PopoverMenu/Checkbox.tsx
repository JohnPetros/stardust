'use client'

import { Check } from '@phosphor-icons/react'
import * as C from '@radix-ui/react-checkbox'
import { motion, Variants } from 'framer-motion'
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
  id: string
  isChecked: boolean
}

export function Checkbox({ id, isChecked }: CheckboxProps) {
  return (
    <C.Root
      className={twMerge(
        'ml-6 h-[18px] w-[18px] rounded-md border-2 border-green-400',
        isChecked ? 'bg-green-400' : ' border-gray-500 bg-transparent'
      )}
      checked={isChecked}
      id={id}
    >
      <C.Indicator className="grid place-content-center">
        <motion.div
          variants={indicatorAnimation}
          initial="initial"
          animate="rotate"
        >
          <Check className={' text-green-900'} weight="bold" />
        </motion.div>
      </C.Indicator>
    </C.Root>
  )
}
