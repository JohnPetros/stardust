import { ReactNode } from 'react'

import { Variants, motion } from 'framer-motion'

export const slideAnimations: Variants = {
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

export const slideTransition = {
  duration: 0.5,
  ease: 'easeInOut',
}

interface SlideProps {
  id: string | number
  children: ReactNode
}

export function Slide({ id, children }: SlideProps) {
  return (
    <motion.div
      key={id}
      variants={slideAnimations}
      initial="right"
      animate="middle"
      exit="left"
      transition={slideTransition}
      className="mx-auto w-full h-full flex flex-col items-center justify-center"
    >
      {children}
    </motion.div>
  )
}
