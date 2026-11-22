import type { SpaceService } from '@stardust/core/space/interfaces'
import type { User } from '@stardust/core/global/entities'
import { Slug } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'
import { GalaxyTrail } from '@stardust/core/space/structures'

export async function getCurrentGalaxyTrail(
  service: SpaceService,
  user: User,
): Promise<GalaxyTrail | null> {
  const currentGalaxyResponse = await service.fetchCurrentGalaxy()
  if (currentGalaxyResponse.isFailure) return null

  const planetsResponse = await service.fetchGalaxyPlanets(
    Slug.create(currentGalaxyResponse.body.galaxy.slug),
  )
  if (planetsResponse.isFailure) return null

  return GalaxyTrail.create({
    planets: planetsResponse.body.map(Planet.create),
    completedStarsIds: user.completedStarsIds,
    openedPlanetsIds: user.openedPlanetsIds,
  })
}
