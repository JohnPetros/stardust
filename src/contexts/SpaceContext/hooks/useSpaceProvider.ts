'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'

import type { SpaceRocket } from '../types/SpaceRocket'
import type { StarViewPortPosition } from '../types/StarViewPortPosition'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { getImage } from '@/global/helpers'
import { useRocket } from '@/global/hooks/useRocket'

export function useSpaceProvider() {
  const { user } = useAuthContext()
  const { rocket } = useRocket(user?.rankingId ?? '')
  const [spaceRocket, setSpaceRocket] = useState<SpaceRocket>({} as SpaceRocket)
  const [lastUnlockedStarPosition, setLastUnlockedStarPosition] =
    useState<StarViewPortPosition>('above')
  const lastUnlockedStarRef = useRef<HTMLLIElement>(null)

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', () => {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    const starHeight = starRect?.height

    const starYPosition = starRect?.top

    if (!starYPosition || !starHeight) return

    if (starYPosition > window.innerHeight) setLastUnlockedStarPosition('above')

    if (starYPosition + starHeight < 0) setLastUnlockedStarPosition('bellow')
  })

  function scrollIntoLastUnlockedStar() {
    const starRect = lastUnlockedStarRef.current?.getBoundingClientRect()

    if (!starRect) return

    const starHeight = starRect?.height
    const starTopPosition = starRect.top + window.scrollY

    if (starTopPosition && starHeight) {
      const starPosition =
        starTopPosition - (window.innerHeight - starHeight) / 2

      window.scrollTo({
        top: starPosition,
        behavior: 'smooth',
      })
    }
  }

  const spaceContextValue = useMemo(
    () => ({
      spaceRocket,
      lastUnlockedStarRef,
      lastUnlockedStarPosition,
      scrollIntoLastUnlockedStar,
      setLastUnlockedStarPosition,
    }),
    [lastUnlockedStarRef, lastUnlockedStarPosition, spaceRocket]
  )

  useEffect(() => {
    if (rocket?.image && rocket?.name) {
      const rocketImage = getImage('rockets', rocket.image)

      setSpaceRocket({ image: rocketImage, name: rocket.name })
    }
  }, [rocket, user?.rocketId])

  return spaceContextValue
}
