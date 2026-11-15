import type { RefObject } from 'react'
import type { LastUnlockedStarViewPortPosition } from './LastUnlockedStarViewPortPosition'
import type { Id } from '@stardust/core/global/structures'
import type { Planet } from '@stardust/core/space/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'

export type SpaceContextValue = {
  planets: Planet[]
  galaxy: CurrentGalaxyDto['galaxy']
  isFirstGalaxy: boolean
  hasGalaxyChoice: boolean
  isStarUnlocked: (starId: Id) => boolean
  lastUnlockedStarId: string | null
  lastUnlockedStarRef: RefObject<HTMLDivElement | null>
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  getLastUnlockedStarLayoutSnapshot: () => string | null
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (
    viewPortposition: LastUnlockedStarViewPortPosition,
  ) => void
}
