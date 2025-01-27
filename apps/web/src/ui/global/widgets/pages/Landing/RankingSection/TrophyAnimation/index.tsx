'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { useTrophyAnimation } from './useTrophyAnimation'

export function TrophyAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationRef>(null)
  useTrophyAnimation(containerRef, animationRef)

  return (
    <div ref={containerRef}>
      <Animation ref={animationRef} name='trophy' size={240} hasLoop={false} />
    </div>
  )
}
