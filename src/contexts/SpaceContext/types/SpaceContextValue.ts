import { RefObject } from 'react'

import type { SpaceRocket } from './SpaceRocket'
import type { StarViewPortPosition } from './StarViewPortPosition'

export type SpaceContextValue = {
  spaceRocket: SpaceRocket
  lastUnlockedStarRef: RefObject<HTMLLIElement>
  lastUnlockedStarPosition: StarViewPortPosition
  scrollIntoLastUnlockedStar: () => void
  setLastUnlockedStarPosition: (position: StarViewPortPosition) => void
}
