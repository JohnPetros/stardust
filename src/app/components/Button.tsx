'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { Animation } from './Animation'
import Loading from '../../../public/animations/loading.json'

import { MotionProps, motion } from 'framer-motion'

type ButtonProps = {
  children: ReactNode
  className?: string
  isLoading?: boolean
}

export function Button({
  children,
  className,
  isLoading = false,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & MotionProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.99 }}
      className={twMerge(
        'py-2 px-4 rounded bg-green-400 w-full font-semibold',
        className
      )}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? <Animation src={Loading} size={12} /> : children}
    </motion.button>
  )
}
