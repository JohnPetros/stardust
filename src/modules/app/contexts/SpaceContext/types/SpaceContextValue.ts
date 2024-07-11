import type { RefObject } from 'react'
import type { LastUnlockedStarViewPortPosition } from './LastUnlockedStarViewPortPosition'
import type { Space } from '@/@core/domain/structs'

export type SpaceContextValue = {
  space: Space
  lastUnlockedStarRef: RefObject<HTMLLIElement>
  lastUnlockedStarPosition: LastUnlockedStarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (
    viewPortposition: LastUnlockedStarViewPortPosition
  ) => void
}
