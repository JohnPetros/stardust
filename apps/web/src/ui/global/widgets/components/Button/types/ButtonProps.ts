import type { HTMLMotionProps } from 'motion/react'
import type { ReactNode, ComponentProps } from 'react'

export type ButtonProps = {
  children: ReactNode
  className?: string
  isLoading?: boolean
  asChild?: boolean
  testId?: string
} & ComponentProps<'button'> &
  HTMLMotionProps<'button'>
