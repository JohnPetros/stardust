'use client'

import { useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import useSWR from 'swr'

import type { Star } from '@/types/star'
import type { Planet } from '@/types/planet'
import { api } from '@/services/api'
import { UserUnlockedStars } from '@/types/relations'

export function usePlanet() {
  const { user } = useAuth()

  async function getUserUnlockedStars() {
    if (user?.id) {
      return api.getUserUnlockedStars(user?.id)
    }
  }

  const { data: planets } = useSWR('/planets', api.getPlanets)
  const { data: userUnlockedStars } = useSWR(
    '/unlocked_stars?user_id=' + user?.id,
    getUserUnlockedStars
  )

  const [lastUnlockedStarId, setLasUnlockedStarId] = useState('')

  function verifyStarUnlocking(
    planet: Planet,
    userUnlockedStars: UserUnlockedStars[]
  ) {
    const { stars } = planet

    const verifiedStars = stars.map((star) => {
      const isUnlocked = userUnlockedStars.some(
        (userUnlockedStar) => userUnlockedStar.star_id === star.id
      )

      if (isUnlocked) {
        setLasUnlockedStarId(star.id)
      }

      return { ...star, isUnlocked }
    })

    planet.stars = verifiedStars
    return planet
  }

  const data = useMemo(() => {
    if (planets?.length && userUnlockedStars?.length) {
      return planets.map((planet) =>
        verifyStarUnlocking(planet, userUnlockedStars)
      )
    }
  }, [planets, userUnlockedStars])

  return {
    planets: data,
    lastUnlockedStarId,
  }
}
