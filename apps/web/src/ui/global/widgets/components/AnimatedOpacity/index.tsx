'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { PropsWithChildren } from 'react'

type AnimatedFormProps = {
  delay: number // seconds
  isVisible?: boolean
  className?: string
}

export function AnimatedOpacity({
  children,
  className,
  delay = 0.5,
  isVisible = true,
}: PropsWithChildren<AnimatedFormProps>) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: delay } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
