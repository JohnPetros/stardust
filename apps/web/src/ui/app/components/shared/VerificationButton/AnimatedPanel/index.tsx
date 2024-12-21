import { AnimatePresence, motion, type Variants } from 'framer-motion'

import type { ReactNode } from 'react'

const feedbackAnimations: Variants = {
  down: {
    height: 0,
  },
  up: {
    height: 80,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
}

export type AnimatedPanelProps = {
  children: ReactNode
  isAnswerVerified: boolean
}

export function AnimatedPanel({ children, isAnswerVerified }: AnimatedPanelProps) {
  return (
    <AnimatePresence>
      {isAnswerVerified && (
        <motion.div variants={feedbackAnimations} initial='down' animate='up' exit='down'>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
