import type { ReactNode } from 'react'
import { AnimatePresence, type Variants, motion } from 'motion/react'

const formVariants: Variants = {
  initial: {
    opacity: 0,
    x: -250,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.4,
    },
  },
  hidden: {
    opacity: 0,
    x: -750,
    transition: {
      duration: 2,
    },
  },
}

type AnimatedFormProps = {
  isVisible: boolean
  children: ReactNode
}

export function AnimatedForm({ isVisible, children }: AnimatedFormProps) {
  return (
    <AnimatePresence>
      {!isVisible && (
        <motion.div
          variants={formVariants}
          initial='initial'
          animate='visible'
          exit='hidden'
          className='w-full max-w-[320px]'
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
