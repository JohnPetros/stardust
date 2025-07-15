'use client'

import type { ReactNode } from 'react'
import { motion, type Variants, type HTMLMotionProps } from 'motion/react'
import { twMerge } from 'tailwind-merge'

import type { CheckboxStyle } from '../CheckboxStyle'
import { CHECKBOX_STYLES } from '../checkbox-styles'

const variants: Variants = {
  hover: {
    scale: 1.02,
  },
  tap: {
    scale: 0.99,
  },
}

type AnimatedLabelProps = {
  children: ReactNode
  checkboxStyle: CheckboxStyle
} & HTMLMotionProps<'label'>

export function AnimatedLabel({
  children,
  checkboxStyle,
  ...labelParams
}: AnimatedLabelProps) {
  return (
    <motion.label
      variants={variants}
      whileHover='hover'
      whileTap='tap'
      className={twMerge(
        'flex w-full cursor-pointer items-center gap-3 rounded-md border border-gray-100 bg-purple-700 p-3',
        CHECKBOX_STYLES[checkboxStyle],
      )}
      {...labelParams}
    >
      {children}
    </motion.label>
  )
}
