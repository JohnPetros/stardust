import type { RefObject } from 'react'

import type { Planet } from '@stardust/core/space/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import type { GalaxyTrail, GalaxyTrailCurrentItem } from '@stardust/core/space/structures'

import type { AnimationRef } from '@/ui/global/widgets/components/Animation/types'
import type { CurrentItemViewportPosition } from './CurrentItemViewportPosition'

export type SpaceContextValue = {
  planets: Planet[]
  galaxy: CurrentGalaxyDto['galaxy']
  isFirstGalaxy: boolean
  hasGalaxyChoice: boolean
  trail: GalaxyTrail | null
  currentItem: GalaxyTrailCurrentItem
  selectedStarId: string | null
  isStarDetailsOpen: boolean
  selectStar: (starId: string) => void
  openStarDetails: () => void
  closeStarDetails: () => void
  registerStarAnimation: (
    starId: string,
    animationRef: RefObject<AnimationRef | null>,
  ) => () => void
  restartStarAnimation: (starId: string) => void
  currentItemRef: RefObject<HTMLDivElement | null>
  currentItemPosition: CurrentItemViewportPosition
  scrollToCurrentItem: () => void
  getCurrentItemLayoutSnapshot: () => string | null
  setCurrentItemPosition: (position: CurrentItemViewportPosition) => void
  refreshTrail: () => Promise<void>
}
