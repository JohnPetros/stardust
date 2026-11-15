import { useCallback, useMemo } from 'react'

import type { Id } from '@stardust/core/global/structures'
import type { User } from '@stardust/core/profile/entities'
import type { Planet } from '@stardust/core/space/entities'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'

import { useLastUnlockedStarScroll } from './useLastUnlockedStarScroll'

function findLastUnlockedStarId(
  planets: Planet[],
  firstStarId: Id,
  isStarUnlocked: (starId: Id) => boolean,
) {
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
}

function useStarUnlocking(planets: Planet[], user: User | null) {
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

    return findLastUnlockedStarId(planets, firstStarId, isStarUnlocked)
  }, [user, planets, firstStarId, isStarUnlocked])

  return { isStarUnlocked, lastUnlockedStarId }
}

export function useSpaceContextProvider(
  planets: Planet[],
  user: User | null,
  currentGalaxy: CurrentGalaxyDto,
) {
  const { isStarUnlocked, lastUnlockedStarId } = useStarUnlocking(planets, user)

  const scroll = useLastUnlockedStarScroll(lastUnlockedStarId)

  const spaceContextValue = useMemo(() => {
    return {
      planets,
      galaxy: currentGalaxy.galaxy,
      isFirstGalaxy: currentGalaxy.isFirstGalaxy,
      hasGalaxyChoice: currentGalaxy.hasGalaxyChoice,
      isStarUnlocked,
      lastUnlockedStarId,
      lastUnlockedStarRef: scroll.lastUnlockedStarRef,
      lastUnlockedStarPosition: scroll.lastUnlockedStarPosition,
      getLastUnlockedStarLayoutSnapshot: scroll.getLastUnlockedStarLayoutSnapshot,
      scrollIntoLastUnlockedStar: scroll.scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition: scroll.setLastUnlockedStarPosition,
    }
  }, [
    planets,
    currentGalaxy,
    isStarUnlocked,
    lastUnlockedStarId,
    scroll.lastUnlockedStarPosition,
    scroll.getLastUnlockedStarLayoutSnapshot,
    scroll.scrollIntoLastUnlockedStar,
  ])

  return spaceContextValue
}
