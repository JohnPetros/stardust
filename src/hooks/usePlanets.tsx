'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'

import type { Planet } from '@/@types/planet'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'

export function usePlanets(planets: Planet[]) {
  const { user } = useAuth()
  const api = useApi()

  async function getUserUnlockedStarsIds() {
    if (user?.id) {
      return api.getUserUnlockedStarsIds(user.id)
    }
  }

  const { data: userUnlockedStarsIds, error } = useSWR(
    '/unlocked_stars_ids?user_id=' + user?.id,
    getUserUnlockedStarsIds
  )

  if (error) {
    throw new Error(error)
  }

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
    if (userUnlockedStarsIds?.length) {
      return planets.map((planet) =>
        verifyStarUnlocking(planet, userUnlockedStarsIds)
      )
    }
  }, [planets, userUnlockedStarsIds])

  return {
    data,
    lastUnlockedStarId,
  }
}
