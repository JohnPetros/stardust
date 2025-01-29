'use client'

import { type ComponentProps, useRef } from 'react'
import { motion } from 'framer-motion'

import { useAnimatedBorder } from './useAnimatedBorder'

export function AnimatedBorder({ children, ...divProps }: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { maskImage } = useAnimatedBorder(containerRef)

  return (
    <div ref={containerRef} {...divProps} className='relative p-6'>
      <motion.div
        style={{ maskImage }}
        className='absolute rounded-lg inset-0 -m-px border border-green-600'
      />
      <div className='rounded-md border border-gray-700'>{children}</div>
    </div>
  )
}
