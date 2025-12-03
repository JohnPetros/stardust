'use client'

import { type ComponentProps, useRef } from 'react'
import { motion } from 'motion/react'

import { useAnimatedBorder } from './useAnimatedBorder'
import { twMerge } from 'tailwind-merge'

export const AnimatedBorderView = ({
  children,
  className,
  ...divProps
}: ComponentProps<'div'>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { maskImage } = useAnimatedBorder(containerRef)

  return (
    <div ref={containerRef} {...divProps} className='relative'>
      <motion.div
        style={{ maskImage }}
        className='absolute rounded-md inset-0 -m-px border border-green-600 z-0'
      />
      <div className={twMerge('rounded-md border border-gray-700 p-6 z-10', className)}>
        {children}
      </div>
    </div>
  )
}
