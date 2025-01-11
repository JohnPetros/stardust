'use client'

import type { ComponentProps } from 'react'
import { AnimatePresence } from 'framer-motion'

export function Container({ children }: ComponentProps<'div'>) {
  return <AnimatePresence mode='popLayout'>{children}</AnimatePresence>
}
