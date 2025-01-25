import { AnimatePresence, motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

type AnimatedFormProps = {
  delay: number // seconds
  isVisible?: boolean
}

export function AnimatedOpacity({
  children,
  delay = 0.5,
  isVisible = true,
}: PropsWithChildren<AnimatedFormProps>) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
