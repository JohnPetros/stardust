'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import { Planet } from '@stardust/core/space/entities'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import { GetLastUnlockedStarIdUseCase } from '@stardust/core/space/use-cases'

import { useScrollEvent } from '@/ui/global/hooks/useScrollEvent'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { LastUnlockedStarViewPortPosition } from '../types'

export function useSpaceProvider(planetsDto: PlanetDto[]) {
  const { user } = useAuthContext()

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
    const getLastUnlockedStarIdUseCase = new GetLastUnlockedStarIdUseCase()
    const lastUnlockedStarId = user
      ? getLastUnlockedStarIdUseCase.do({
          planetsDto,
          userDto: user?.dto,
        })
      : null

    return {
      planets: planetsDto.map(Planet.create),
      lastUnlockedStarId,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [user, planetsDto, lastUnlockedStarPosition, scrollIntoLastUnlockedStar])

  return spaceContextValue
}
