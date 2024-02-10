'use server'

import { Planet } from '@/@types/Planet'
import { IPlanetsController } from '@/services/api/interfaces/IPlanetsController'

function verifyStarUnlocking(planet: Planet, userUnlockedStarsIds: string[]) {
  const { stars } = planet

  const verifiedStars = stars.map((star) => {
    const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)

    return { ...star, isUnlocked }
  })

  planet.stars = verifiedStars
  return planet
}

export async function _getPlanets(
  userUnlockedStarsIds: string[],
  planetsController: IPlanetsController
) {
  const planets = await planetsController.getPlanets()

  return planets.map((planet) =>
    verifyStarUnlocking(planet, userUnlockedStarsIds)
  )
}
