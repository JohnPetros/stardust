import type { RefObject } from 'react'
import type { LastUnlockedStarViewPortPosition } from './LastUnlockedStarViewPortPosition'
import type { Planet } from '@/@core/domain/entities'

export type SpaceContextValue = {
  planets: Planet[]
  lastUnlockedStarId: string | null
  lastUnlockedStarRef: RefObject<HTMLLIElement>
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (
    viewPortposition: LastUnlockedStarViewPortPosition
  ) => void
}
