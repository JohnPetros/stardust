'use client'

import type { ReactNode } from 'react'

import { AnimatedContainerView } from './AnimatedContainerView'

type AnimatedContainerProps = {
  children: ReactNode
}

export function AnimatedContainer({ children }: AnimatedContainerProps) {
  return <AnimatedContainerView>{children}</AnimatedContainerView>
}
