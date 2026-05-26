'use client'

import type { ReactNode } from 'react'

import { AnimatedContainerView } from './AnimatedContainerView'

type AnimatedContainerProps = {
  children: ReactNode
  isSidenavExpanded: boolean
  onClick: VoidFunction
}

export function AnimatedContainer({
  children,
  isSidenavExpanded,
  onClick,
}: AnimatedContainerProps) {
  return (
    <AnimatedContainerView isSidenavExpanded={isSidenavExpanded} onClick={onClick}>
      {children}
    </AnimatedContainerView>
  )
}
