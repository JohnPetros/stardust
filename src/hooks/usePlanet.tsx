'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import type { Planet } from '@/@types/planet'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'

export function usePlanet() {
  const { user } = useAuth()
  const api = useApi()

  async function getUserUnlockedStarsIds() {
    if (user?.id) {
      return api.getUserUnlockedStarsIds(user.id)
    }
  }

  const { data: planets } = useSWR('/planets', api.getPlanets)
  const { data: userUnlockedStarsIds } = useSWR(
    '/unlocked_stars_ids?user_id=' + user?.id,
    getUserUnlockedStarsIds
  )

  const [lastUnlockedStarId, setLasUnlockedStarId] = useState('')

  function verifyStarUnlocking(planet: Planet, userUnlockedStarsIds: string[]) {
    const { stars } = planet

    const verifiedStars = stars.map((star) => {
      const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)

      if (isUnlocked) {
        setLasUnlockedStarId(star.id)
      }

      return { ...star, isUnlocked }
    })

    planet.stars = verifiedStars
    return planet
  }

  const data = useMemo(() => {
    if (planets?.length && userUnlockedStarsIds?.length) {
      return planets.map((planet) =>
        verifyStarUnlocking(planet, userUnlockedStarsIds)
      )
    }
  }, [planets, userUnlockedStarsIds])

  return {
    planets: data,
    lastUnlockedStarId,
  }
}
