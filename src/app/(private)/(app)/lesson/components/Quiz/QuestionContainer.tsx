'use client'

import { ReactNode } from 'react'
import { AnimatePresence, Variants, motion } from 'framer-motion'

export const questionAnimations: Variants = {
  right: {
    position: 'absolute',
    opacity: 0,
    x: 64,
  },
  middle: {
    position: 'static',
    opacity: 1,
    x: 0,
  },
  left: {
    position: 'absolute',
    opacity: 1,
    y: -240,
  },
}

export const questionTransition = {
  duration: 0.5,
  ease: 'easeInOut',
}

interface QuestionContainerProps {
  children: ReactNode
}

export function QuestionContainer({ children }: QuestionContainerProps) {
  return (
    <AnimatePresence>
      <motion.div
        variants={questionAnimations}
        initial="right"
        animate={'middle'}
        exit="left"
        transition={questionTransition}
        className="mx-auto w-ful max-w-xl flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
