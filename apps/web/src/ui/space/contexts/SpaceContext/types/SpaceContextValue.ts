import type { RefObject } from 'react'
import type { LastUnlockedStarViewPortPosition } from './LastUnlockedStarViewPortPosition'
import type { Planet } from '@stardust/core/space/entities'

export type SpaceContextValue = {
  planets: Planet[]
  lastUnlockedStarId: string | null
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (
    viewPortposition: LastUnlockedStarViewPortPosition,
  ) => void
}
