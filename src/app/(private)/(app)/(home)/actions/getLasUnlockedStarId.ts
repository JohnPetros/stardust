'use server'

import { Planet } from '@/@types/planet'

export async function getLasUnlockedStarId(
  planets: Planet[],
  userUnlockedStarsIds: string[]
) {
  let lasUnlockedStarId = ''

  for (const planet of planets) {
    const stars = planet.stars

    for (const star of stars) {
      const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)

      if (isUnlocked) {
        lasUnlockedStarId = star.id
      }
    }
  }

  return lasUnlockedStarId ?? planets[0].stars[0].id
}
