'use client'

import type { ReactNode } from 'react'
import { motion, type Transition, type Variants } from 'motion/react'

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

export const questionContainerTransition: Transition = {
  duration: 0.4,
  ease: 'easeInOut',
}

type QuestionContainerProps = {
  children: ReactNode
  id: string
}

export function QuestionContainer({ children, id }: QuestionContainerProps) {
  return (
    <motion.div
      key={id}
      variants={questionContainerAnimations}
      initial='right'
      animate='middle'
      exit='left'
      transition={questionContainerTransition}
      className='mx-auto flex w-full max-w-3xl flex-col items-center px-6 md:px-0'
    >
      <div className='flex-grow' />
      {children}
      <div className='flex-grow' />
    </motion.div>
  )
}
