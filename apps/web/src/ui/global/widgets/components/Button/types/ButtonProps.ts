import type { MotionProps } from 'framer-motion'
import type { ReactNode, ComponentProps } from 'react'

export type ButtonProps = {
  children: ReactNode
  className?: string
  isLoading?: boolean
  asChild?: boolean
} & ComponentProps<'button'> &
  MotionProps
