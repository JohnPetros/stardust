'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Icon } from '../Icon'
import type { IconName } from '../Icon/types'

const fabAnimations: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
  },
  tap: {
    scale: 0.8,
  },
}

type FabProps = {
  isVisible: boolean
  icon: IconName
  label: string
  onClick: VoidFunction
}

export function Fab({ isVisible, icon, onClick, label }: FabProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={fabAnimations}
          initial='hidden'
          animate='visible'
          exit='hidden'
          whileTap='tap'
          onClick={onClick}
          className='fixed bottom-8 right-24 grid h-12 w-12 place-content-center rounded-md border-b-2 border-green-500 bg-gray-900'
          tabIndex={0}
          aria-label={label}
        >
          <Icon name={icon} className='text-2xl text-green-500' weight='bold' />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
