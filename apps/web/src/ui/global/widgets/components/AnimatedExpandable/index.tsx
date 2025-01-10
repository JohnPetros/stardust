import type { PropsWithChildren } from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'
import { AnimatePresence, type Variants, motion } from 'framer-motion'

const variants: Variants = {
  up: {
    height: 0,
  },
  down: {
    height: 'auto',
  },
}

type AnimatedExpandableProps = {
  isExpanded: boolean
  className?: ClassNameValue
}

export function AnimatedExpandable({
  isExpanded,
  className,
  children,
}: PropsWithChildren<AnimatedExpandableProps>) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          variants={variants}
          initial='up'
          animate={isExpanded ? 'down' : ''}
          exit='up'
          className={twMerge('overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
