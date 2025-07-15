import type { PropsWithChildren } from 'react'
import { AnimatePresence, type Variants, motion } from 'motion/react'

const variants: Variants = {
  up: {
    height: 0,
  },
  down: {
    height: 'auto',
  },
}

type Props = {
  isOpen: boolean
}

export const AnimatedFieldsContainerView = ({
  isOpen,
  children,
}: PropsWithChildren<Props>) => {
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
