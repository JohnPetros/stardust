'use client'

import { Icon } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'

const fabButtonAnimations: Variants = {
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

interface FabButtonProps {
  isVisible: boolean
  icon: Icon
  onClick: VoidFunction
}

export function FabButton({ isVisible, icon: Icon, onClick }: FabButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={fabButtonAnimations}
          initial="hidden"
          animate="visible"
          exit="hidden"
          whileTap="tap"
          onClick={onClick}
          className="fixed bottom-8 right-24 grid h-12 w-12 place-content-center rounded-md border-b-2 border-green-500 bg-gray-900"
          tabIndex={0}
          aria-label="Dar scroll até a última estrela desbloqueada"
        >
          <Icon className="text-2xl text-green-500" weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
