import type { PropsWithChildren } from 'react'
import { AnimatePresence, type Variants, motion } from 'framer-motion'

const variants: Variants = {
  up: {
    height: 0,
  },
  down: {
    height: 'auto',
  },
}

type AnimatedFieldsContainerProps = {
  isOpen: boolean
}

export function AnimatedFieldsContainer({
  isOpen,
  children,
}: PropsWithChildren<AnimatedFieldsContainerProps>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dl
          variants={variants}
          initial='up'
          animate={isOpen ? 'down' : ''}
          exit='up'
          className='mt-4 space-y-3 overflow-hidden'
        >
          {children}
        </motion.dl>
      )}
    </AnimatePresence>
  )
}
