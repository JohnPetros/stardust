'use client'

import type { ComponentProps } from 'react'
import { AnimatePresence } from 'motion/react'

export function Container({ children, ...divProps }: ComponentProps<'div'>) {
  return (
    <AnimatePresence mode='popLayout'>
      <div {...divProps}>{children}</div>
    </AnimatePresence>
  )
}
