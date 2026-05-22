'use client'

import type { ReactNode } from 'react'

import { AnimatedContainerView } from './AnimatedContainerView'

type SidenavProps = {
  children: ReactNode
  isExpanded: boolean
}

export function AnimatedContainer({ children, isExpanded }: SidenavProps) {
  return <AnimatedContainerView isExpanded={isExpanded}>{children}</AnimatedContainerView>
}
