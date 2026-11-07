'use client'

import { Slot } from '@radix-ui/react-slot'
import { motion } from 'motion/react'
import { forwardRef } from 'react'
import { extendTailwindMerge } from 'tailwind-merge'

import { Loading } from '../Loading'
import type { ButtonProps } from './types/ButtonProps'

// Faz com que `h-theme-control` e `rounded-theme` entrem nos mesmos grupos de
// `h-*` e `rounded-*`, para que os overrides de `className` dos chamadores prevaleçam.
const twMerge = extendTailwindMerge({
  theme: {
    borderRadius: ['theme', 'theme-full'],
  },
  classGroups: {
    h: [{ h: ['theme-control'] }],
  },
})

export const ButtonView = forwardRef<HTMLButtonElement, ButtonProps>(function ButtonView(
  { children, className, asChild = false, isLoading = false, disabled, testId, ...rest },
  ref,
) {
  const mergedClassName = twMerge(
    'duration-400 relative flex h-theme-control w-full cursor-pointer items-center justify-center overflow-hidden rounded-theme bg-theme-action text-sm font-medium text-theme-canvas transition-all hover:brightness-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action disabled:pointer-events-none disabled:opacity-70',
    className,
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
      type='button'
      ref={ref}
      whileTap={{ scale: 0.99 }}
      className={mergedClassName}
      disabled={disabled || isLoading}
      data-testid={testId}
      {...rest}
    >
      {isLoading ? <Loading /> : children}
    </motion.button>
  )
})
