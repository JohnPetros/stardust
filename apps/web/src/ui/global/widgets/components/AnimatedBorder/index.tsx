'use client'

import { type ComponentProps, useRef } from 'react'
import { motion } from 'framer-motion'

import { useAnimatedBorder } from './useAnimatedBorder'
import { twMerge } from 'tailwind-merge'

export function AnimatedBorder({
  children,
  className,
  ...divProps
}: ComponentProps<'div'>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { maskImage } = useAnimatedBorder(containerRef)

  return (
    <div ref={containerRef} {...divProps} className='relative'>
      <motion.div
        style={{ maskImage }}
        className='absolute rounded-md inset-0 -m-px border border-green-600'
      />
      <div className={twMerge('rounded-md border border-gray-700 p-6', className)}>
        {children}
      </div>
    </div>
  )
}
