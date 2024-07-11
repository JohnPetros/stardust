'use client'

import { useMemo, useRef, useState } from 'react'

import type { LastUnlockedStarViewPortPosition } from '../types'
import type { Space } from '@/@core/domain/structs'
import { useScrollEvent } from '@/modules/global/hooks'

export function useSpaceProvider(space: Space) {
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

  const spaceContextValue = useMemo(
    () => ({
      space,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }),
    [lastUnlockedStarRef, lastUnlockedStarPosition]
  )

  return spaceContextValue
}
