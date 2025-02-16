'use client'

import { useRef } from 'react'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { usePodiumAnimation } from './usePodiumAnimation'

export function PodiumAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationRef>(null)
  usePodiumAnimation(containerRef, animationRef)

  return (
    <div ref={containerRef}>
      <Animation ref={animationRef} name='podium' size={240} hasLoop={false} />
    </div>
  )
}
