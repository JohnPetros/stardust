'use client'

import { AnimatedLabelView } from './AnimatedLabelView'

type AnimatedLabelProps = {
  children: string
  isExpanded: boolean
  isActive: boolean
}

export function AnimatedLabel({ children, isExpanded, isActive }: AnimatedLabelProps) {
  return (
    <AnimatedLabelView isExpanded={isExpanded} isActive={isActive}>
      {children}
    </AnimatedLabelView>
  )
}
