'use client'

import { useReducedMotion } from 'motion/react'

import type { GalaxySummaryDto } from '@stardust/core/space/entities/dtos'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import { GalaxyItemView } from './GalaxyItemView'

type Props = {
  galaxy: GalaxySummaryDto
  side: 'start' | 'end'
  isPending: boolean
  onEnter: (galaxy: GalaxySummaryDto) => void
}

export function GalaxyItem({ galaxy, side, isPending, onEnter }: Props) {
  const animationUrl = useFileStorage(
    FileStorageFolderPath.createAsLottiesGalaxies(),
    galaxy.animation,
  )
  const shouldReduceMotion = useReducedMotion()

  return (
    <GalaxyItemView
      galaxy={galaxy}
      side={side}
      animationUrl={animationUrl}
      isAnimationStatic={galaxy.status === 'announced' || Boolean(shouldReduceMotion)}
      isPending={isPending}
      onEnter={onEnter}
    />
  )
}
