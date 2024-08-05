import { motion } from 'framer-motion'
import { ReactNode } from 'react'

type AnimatedFormProps = {
  children: ReactNode
  delay: number // seconds
}

export function AnimatedContainer({ children, delay = 0.5 }: AnimatedFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay }}
    >
      {children}
    </motion.div>
  )
}
