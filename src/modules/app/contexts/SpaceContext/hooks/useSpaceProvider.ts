'use client'

import { useMemo, useRef, useState } from 'react'

import { Planet } from '@/@core/domain/entities'
import type { PlanetDTO } from '@/@core/dtos'

import { useScrollEvent } from '@/modules/global/hooks'
import type { LastUnlockedStarViewPortPosition } from '../types'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { GetLastUnlockedStarIdUseCase } from '@/@core/use-cases/planets'

export function useSpaceProvider(planetsDTO: PlanetDTO[]) {
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

  function scrollIntoLastUnlockedStar() {
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
  }

  useScrollEvent(handleScroll)

  const spaceContextValue = useMemo(() => {
    const getLastUnlockedStarIdUseCase = new GetLastUnlockedStarIdUseCase()
    const lastUnlockedStarId = user
      ? getLastUnlockedStarIdUseCase.do({
          planetsDTO,
          userDTO: user?.dto,
        })
      : null

    return {
      planets: planetsDTO.map(Planet.create),
      lastUnlockedStarId,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }
  }, [user, planetsDTO, lastUnlockedStarPosition])

  return spaceContextValue
}
