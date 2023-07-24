import { useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import useSWR from 'swr'

import type { Star } from '@/types/star'
import type { Planet } from '@/types/planet'
import { api } from '@/services/api'

export function usePlanet() {
  const { user } = useAuth()

  async function getUserUnlockedStars() {
    if (user?.id) {
      return api.getUserUnlockedStars(user?.id)
    }
  }

  const { data: planets, error } = useSWR('planets', api.getPlanets)
  const { data: unlockedStars } = useSWR(
    user?.id ? 'unlocked_stars' : null,
    getUserUnlockedStars
  )
  const [lastUnlockedStarId, setLasUnlockedStarId] = useState('')

  function verifyStarUnlocking(planet: Planet, unlockedStars: Star[]) {
    const { stars } = planet
    const verifiedStars = stars.map((star) => {
      const isUnlocked = unlockedStars.some(
        (unlockedStar) => unlockedStar.id === star.id
      )
      if (isUnlocked) setLasUnlockedStarId(star.id)
      return { ...star, isUnlocked }
    })

    planet.stars = verifiedStars
    return planet
  }

  const data = useMemo(() => {
    if (planets && unlockedStars) {
      return planets.map((planet) => verifyStarUnlocking(planet, unlockedStars))
    }
  }, [planets, unlockedStars])

  return {
    planets: data,
    lastUnlockedStarId,
  }
}
