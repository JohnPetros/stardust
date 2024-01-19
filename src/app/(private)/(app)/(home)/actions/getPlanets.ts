'use server'

import { Planet } from '@/@types/planet'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { PlanetsController } from '@/services/api/supabase/controllers/planetsController'

function verifyStarUnlocking(planet: Planet, userUnlockedStarsIds: string[]) {
  const { stars } = planet

  const verifiedStars = stars.map((star) => {
    const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)

    return { ...star, isUnlocked }
  })

  planet.stars = verifiedStars
  return planet
}

export async function getPlanets(userUnlockedStarsIds: string[]) {
  const supabase = createServerClient()

  const planetsController = PlanetsController(supabase)

  const planets = await planetsController.getPlanets()

  return planets.map((planet) =>
    verifyStarUnlocking(planet, userUnlockedStarsIds)
  )
}
