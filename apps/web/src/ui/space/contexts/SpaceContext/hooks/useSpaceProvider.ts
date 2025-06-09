import { useCallback, useMemo, useRef, useState } from 'react'

import type { Planet } from '@stardust/core/space/entities'
import type { User } from '@stardust/core/profile/entities'

import { useScrollEvent } from '@/ui/global/hooks/useScrollEvent'
import type { LastUnlockedStarViewPortPosition } from '../types'

export function useSpaceProvider(planets: Planet[], user: User | null) {
  const [lastUnlockedStarPosition, setLastUnlockedStarPosition] =
    useState<LastUnlockedStarViewPortPosition>('above')
  const lastUnlockedStarRef = useRef<HTMLLIElement>(null)

  function handleScroll() {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    const starHeight = starRect?.height

    const starYPosition = starRect?.top

    if (!starYPosition || !starHeight) return

    if (starYPosition > window.innerHeight) setLastUnlockedStarPosition('above')

    if (starYPosition + starHeight < 0) setLastUnlockedStarPosition('bellow')
  }

  const scrollIntoLastUnlockedStar = useCallback(() => {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    if (!starRect) return

    const starHeight = starRect?.height
    const starTopPosition = starRect.top + window.scrollY

    if (starTopPosition && starHeight) {
      const starPosition = starTopPosition - (window.innerHeight - starHeight) / 2

      window.scrollTo({
        top: starPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  useScrollEvent(handleScroll)

  const spaceContextValue = useMemo(() => {
    function getLastUnlockedStarId() {
      if (!user) return null

      const reversedPlants = [...planets]
      reversedPlants.reverse()

      for (const planet of reversedPlants) {
        const reversedStars = [...planet.stars]
        reversedStars.reverse()

        for (const star of reversedStars) {
          const isUnlocked = user.hasUnlockedStar(star.id)

          if (isUnlocked.isTrue) {
            return star.id.value
          }
        }
      }

      const lastUnlockedStarId = planets[0]?.stars[0]?.id
      return lastUnlockedStarId?.value
    }

    const lastUnlockedStarId = getLastUnlockedStarId()

    return {
      planets,
      lastUnlockedStarId,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [user, planets, lastUnlockedStarPosition, scrollIntoLastUnlockedStar])

  return spaceContextValue
}
