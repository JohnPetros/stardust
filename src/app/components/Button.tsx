'use client'
import { ButtonHTMLAttributes, ReactNode } from 'react'

import { Loading } from './Loading'

import { twMerge } from 'tailwind-merge'
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
        'h-10 w-full flex justify-center items-center rounded bg-green-400 font-semibold relative overflow-hidden hover:brightness-110 transition-all duration-200',
        className
      )}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </motion.button>
  )
}
