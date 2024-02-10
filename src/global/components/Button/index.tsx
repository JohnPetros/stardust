'use client'

import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  ReactNode,
} from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion, MotionProps } from 'framer-motion'
import { twMerge } from 'tailwind-merge'

import { Loading } from '../Loading'

type ButtonProps = {
  children: ReactNode
  className?: string
  isLoading?: boolean
  asChild?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps

export function ButtonComponent(
  {
    children,
    className,
    asChild = false,
    isLoading = false,
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  const mergedClassName = twMerge(
    'duration-400 custom-outline relative flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded bg-green-400 text-sm font-semibold tracking-wide transition-all hover:brightness-75 disabled:pointer-events-none disabled:opacity-70',
    className
  )

  if (asChild) {
    return (
      <Slot className={mergedClassName} {...rest}>
        {children}
      </Slot>
    )
  }

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.99 }}
      className={mergedClassName}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </motion.button>
  )
}

export const Button = forwardRef(ButtonComponent)
