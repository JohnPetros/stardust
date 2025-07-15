import type { ReactNode } from 'react'
import { type Variants, motion } from 'motion/react'

const variants: Variants = {
  hidden: {
    x: -120,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
}

type AnimatedContainerProps = {
  children: ReactNode
}

export function AnimatedContainer({ children }: AnimatedContainerProps) {
  return (
    <motion.main
      variants={variants}
      className='grid grid-cols-[48px_1fr] gap-2 border-b border-green-500 bg-gray-900 p-4 rounded-t-md overflow-hidden'
      data-testid='achievement'
    >
      {children}
    </motion.main>
  )
}
