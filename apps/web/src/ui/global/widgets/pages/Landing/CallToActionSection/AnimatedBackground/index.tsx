'use client'

import { useRef, type PropsWithChildren } from 'react'

import { Animation } from '@/ui/global/widgets/components/Animation'
import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { useAnimatedBackground } from './useAnimatedBackground'

export function AnimatedBackground({ children }: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationRef>(null)
  useAnimatedBackground(containerRef, animationRef)

  return (
    <div ref={containerRef} className='relative'>
      <Animation
        ref={animationRef}
        name='rocket-crossing-sky'
        size='full'
        hasLoop={false}
      />
      <AnimatedOpacity delay={5}>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 space-y-3'>
          <Animation name='apollo-asking' size='full' />
          {children}
        </div>
      </AnimatedOpacity>
    </div>
  )
}
