'use client'

import type { PropsWithChildren } from 'react'

import { PageTransitionAnimationView } from './PageTransitionAnimationView'

type TransitionPageAnimationProps = PropsWithChildren<{
  isVisible: boolean
}>

export function PageTransitionAnimation({
  isVisible,
  children,
}: TransitionPageAnimationProps) {
  return (
    <PageTransitionAnimationView isVisible={isVisible}>
      {children}
    </PageTransitionAnimationView>
  )
}
