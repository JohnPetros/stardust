import { useCallback, useMemo } from 'react'

import type { Id } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'

import { useLastUnlockedStarScroll } from './useLastUnlockedStarScroll'

export function useSpaceContextProvider(
  planets: Planet[],
  user: User | null,
  currentGalaxy: CurrentGalaxyDto,
) {
  const firstStarId = planets[0]?.stars[0]?.id

  const isStarUnlocked = useCallback(
    (starId: Id) => {
      if (firstStarId && starId.value === firstStarId.value) return true

      return Boolean(user?.hasUnlockedStar(starId).isTrue)
    },
    [user, firstStarId],
  )

  const lastUnlockedStarId = useMemo(() => {
    if (!user) return null

    const reversedPlanets = [...planets]
    reversedPlanets.reverse()

    for (const planet of reversedPlanets) {
      const reversedStars = [...planet.stars]
      reversedStars.reverse()

      for (const star of reversedStars) {
        if (isStarUnlocked(star.id)) {
          return star.id.value
        }
      }
    }

    return firstStarId?.value
  }, [user, planets, firstStarId, isStarUnlocked])

  const {
    lastUnlockedStarRef,
    lastUnlockedStarPosition,
    setLastUnlockedStarPosition,
    getLastUnlockedStarLayoutSnapshot,
    scrollIntoLastUnlockedStar,
  } = useLastUnlockedStarScroll(lastUnlockedStarId)

  const spaceContextValue = useMemo(() => {
    return {
      planets,
      galaxy: currentGalaxy.galaxy,
      isFirstGalaxy: currentGalaxy.isFirstGalaxy,
      hasGalaxyChoice: currentGalaxy.hasGalaxyChoice,
      isStarUnlocked,
      lastUnlockedStarId,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      getLastUnlockedStarLayoutSnapshot,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [
    planets,
    currentGalaxy,
    isStarUnlocked,
    lastUnlockedStarId,
    lastUnlockedStarPosition,
    getLastUnlockedStarLayoutSnapshot,
    scrollIntoLastUnlockedStar,
  ])

  return spaceContextValue
}
