import type { SpaceService } from '@stardust/core/space/interfaces'
import { Slug, type Id } from '@stardust/core/global/structures'
import { Planet } from '@stardust/core/space/entities'

export async function isFirstStarOfCurrentGalaxy(
  service: SpaceService,
  starId: Id,
): Promise<boolean> {
  const currentGalaxyResponse = await service.fetchCurrentGalaxy()
  if (currentGalaxyResponse.isFailure) return false

  const planetsResponse = await service.fetchGalaxyPlanets(
    Slug.create(currentGalaxyResponse.body.galaxy.slug),
  )
  if (planetsResponse.isFailure) return false

  const planets = planetsResponse.body.map(Planet.create)
  planets.sort((a, b) => a.position.value - b.position.value)

  const firstStar = planets[0]?.stars[0]
  return Boolean(firstStar && firstStar.id.value === starId.value)
}
