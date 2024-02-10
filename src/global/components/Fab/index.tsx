'use client'

import { Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'

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
  icon: Icon
  onClick: VoidFunction
  label: string
}

export function Fab({ isVisible, icon: Icon, onClick, label }: FabProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={fabAnimations}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileTap="tap"
          onClick={onClick}
          className="fixed bottom-8 right-24 grid h-12 w-12 place-content-center rounded-md border-b-2 border-green-500 bg-gray-900"
          tabIndex={0}
          aria-label={label}
        >
          <Icon className="text-2xl text-green-500" weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
