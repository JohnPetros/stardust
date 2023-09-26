'use client'

import { ReactNode } from 'react'
import { AnimatePresence, Variants, motion } from 'framer-motion'

export const questionContainerAnimations: Variants = {
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
    opacity: 0,
    y: -240,
  },
}

export const questionContainerTransition = {
  duration: 0.4,
  ease: 'easeInOut',
}

interface QuestionContainerProps {
  children: ReactNode
  id: number
}

export function QuestionContainer({ children, id }: QuestionContainerProps) {
  return (
    <motion.div
      key={id}
      variants={questionContainerAnimations}
      initial="right"
      animate={'middle'}
      exit="left"
      transition={questionContainerTransition}
      className="mx-auto max-w-3xl flex flex-col items-center justify-center px-6 md:px-0"
    >
      {children}
    </motion.div>
  )
}
