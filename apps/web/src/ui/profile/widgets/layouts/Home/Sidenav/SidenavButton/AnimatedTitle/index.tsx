'use client'

import type { ReactNode } from 'react'

import { AnimatedTitleView } from './AnimatedTitleView'

type AnimatedTitleProps = {
  children: ReactNode
  isExpanded: boolean
}

export function AnimatedTitle({ children, isExpanded }: AnimatedTitleProps) {
  return <AnimatedTitleView isExpanded={isExpanded}>{children}</AnimatedTitleView>
}
