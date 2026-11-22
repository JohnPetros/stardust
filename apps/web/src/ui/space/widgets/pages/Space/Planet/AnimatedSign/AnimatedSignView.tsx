import type { ReactNode } from 'react'
import { motion, type Variants } from 'motion/react'
import { twMerge } from 'tailwind-merge'

const variants: Variants = {
  float: {
    y: [6, -6, 6],
    transition: {
      repeat: Infinity,
      duration: 3,
    },
  },
}

const TONE_CLASS_NAME = {
  success: 'border border-theme-success',
  reward: 'border-2 border-theme-reward',
  quiet: 'border border-theme-border-quiet',
} as const

type AnimatedSignProps = {
  children: ReactNode
  tone: keyof typeof TONE_CLASS_NAME
}

export const AnimatedSignView = ({ children, tone }: AnimatedSignProps) => {
  return (
    <motion.div
      variants={variants}
      animate='float'
      className={twMerge(
        'flex w-fit max-w-[calc(100vw-9.5rem)] items-center gap-3 rounded-theme bg-theme-surface p-3 lg:max-w-[340px]',
        TONE_CLASS_NAME[tone],
      )}
    >
      {children}
    </motion.div>
  )
}
