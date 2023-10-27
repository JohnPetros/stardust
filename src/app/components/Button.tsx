'use client'
import { ButtonHTMLAttributes, ReactNode, RefObject } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Loading } from './Loading'

type ButtonProps = {
  buttonRef?: RefObject<HTMLButtonElement>
  children: ReactNode
  className?: string
  isLoading?: boolean
}

export function Button({
  buttonRef,
  children,
  className,
  isLoading = false,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & MotionProps) {
  return (
    <motion.button
      ref={buttonRef}
      whileTap={{ scale: 0.99 }}
      className={twMerge(
        'duration-400 custom-outline relative flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded bg-green-400 font-semibold transition-all hover:brightness-75 disabled:pointer-events-none disabled:opacity-70',
        className
      )}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </motion.button>
  )
}
