'use client'

import { useRef, type PropsWithChildren } from 'react'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAnimatedBackground } from './useAnimatedBackground'

export function AnimatedBackground({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationRef>(null)
  const { isInView, animationDuration } = useAnimatedBackground(
    containerRef,
    animationRef,
  )

  return (
    <div
      ref={containerRef}
      className='relative flex flex-col items-center justify-center'
    >
      <Animation
        ref={animationRef}
        name='rocket-crossing-sky'
        size={600}
        hasLoop={true}
      />
      <AnimatedOpacity isVisible={isInView} delay={animationDuration}>
        <div className='flex items-center justify-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-3 mx-auto w-max'>
          <Animation name='apollo-asking' size={180} />
          {children}
        </div>
      </AnimatedOpacity>
    </div>
  )
}
