'use client'

import { Icon } from '@phosphor-icons/react'
import { motion, AnimatePresence, Variants } from 'framer-motion'

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
          className="fixed right-24 bottom-8 grid place-content-center w-12 h-12 rounded-md border-b-2 border-green-500 bg-gray-900"
          tabIndex={0}
          aria-label="Dar scroll até a última estrela desbloqueada"
        >
          <Icon className="text-green-500 text-2xl" weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}