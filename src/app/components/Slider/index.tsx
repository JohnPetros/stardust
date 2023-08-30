'use client'

import { ReactNode } from 'react'

import { AnimatePresence } from 'framer-motion'

interface SliderProps {
  children: ReactNode
  onChange: VoidFunction | null
}

export function Slider({ children, onChange }: SliderProps) {
  return (
    <div>
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  )
}
