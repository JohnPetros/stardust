import type { PropsWithChildren } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'

import { Animation } from '../Animation'

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  visible: { opacity: 1 },
}

const apolloVariants: Variants = {
  initial: {
    opacity: 0,
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

type Props = PropsWithChildren<{
  isVisible: boolean
}>

export const PageTransitionAnimationView = ({ isVisible, children }: Props) => {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          variants={containerVariants}
          initial='initial'
          animate='visible'
          exit='hidden'
          className='fixed bottom-0 left-0 right-0 top-0 z-[100] flex items-center justify-center bg-gray-900'
          data-testid='page transition'
        >
          <motion.div variants={apolloVariants}>
            <div className='h-[540px]'>
              <Animation name='apollo-riding-rocket' size={540} hasLoop={true} />
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
