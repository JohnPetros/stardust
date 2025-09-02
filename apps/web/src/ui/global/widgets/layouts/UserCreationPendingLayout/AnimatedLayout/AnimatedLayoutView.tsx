import type { PropsWithChildren } from 'react'
import { motion, type Variants } from 'motion/react'

const variants: Variants = {
  hidden: {
    y: 40,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.2,
      duration: 0.4,
    },
  },
}

export const AnimatedLayoutView = ({ children }: PropsWithChildren) => {
  return (
    <motion.div variants={variants} initial='hidden' animate='visible' exit='hidden'>
      {children}
    </motion.div>
  )
}
