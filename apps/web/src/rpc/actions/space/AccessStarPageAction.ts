import type { Action, Call } from '@stardust/core/global/interfaces'
import type { StarDto } from '@stardust/core/space/entities/dtos'
import type { SpaceService } from '@stardust/core/space/interfaces'
import { User } from '@stardust/core/global/entities'
import { Slug } from '@stardust/core/global/structures'
import { Planet, Star } from '@stardust/core/space/entities'
import { GalaxyTrail } from '@stardust/core/space/structures'

type Request = {
  starSlug: string
}

type Response = StarDto

async function getCurrentGalaxyTrail(
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

export const AccessStarPageAction = (
  service: SpaceService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { starSlug } = call.getRequest()
      const user = User.create(await call.getUser())

      const starResponse = await service.fetchStarBySlug(Slug.create(starSlug))
      if (starResponse.isFailure) call.notFound()

      const star = Star.create(starResponse.body)
      const trail = await getCurrentGalaxyTrail(service, user)
      if (!trail || trail.canAccessStar(star.id).isFalse) call.notFound()

      return star.dto
    },
  }
}
