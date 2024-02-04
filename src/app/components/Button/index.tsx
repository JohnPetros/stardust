'use client'

import { ButtonHTMLAttributes, forwardRef, ReactNode, RefObject } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion, MotionProps } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Loading } from '../Loading'

type ButtonProps = {
  buttonRef?: RefObject<HTMLButtonElement>
  children: ReactNode
  className?: string
  isLoading?: boolean
  asChild?: boolean
}

export function ButtonComponent({
  buttonRef,
  children,
  className,
  asChild = false,
  isLoading = false,
  ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & MotionProps) {
  const mergedClassName = twMerge(
    'duration-400 custom-outline relative flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded bg-green-400 text-sm font-semibold tracking-wide transition-all hover:brightness-75 disabled:pointer-events-none disabled:opacity-70',
    className
  )

  console.log({ asChild })

  if (asChild) {
    return (
      <Slot className={mergedClassName} {...rest}>
        {children}
      </Slot>
    )
  }

  return (
    <motion.button
      ref={buttonRef}
      whileTap={{ scale: 0.99 }}
      className={mergedClassName}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </motion.button>
  )
}

export const Button = forwardRef(ButtonComponent)
