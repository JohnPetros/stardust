'use client'

import type { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

export function AnimatedBoard({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 0 }}
      transition={{ durantion: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
