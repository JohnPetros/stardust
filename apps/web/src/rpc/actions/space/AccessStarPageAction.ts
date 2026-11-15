import type { Action, Call } from '@stardust/core/global/interfaces'
import type { StarDto } from '@stardust/core/space/entities/dtos'
import type { SpaceService } from '@stardust/core/space/interfaces'
import { User } from '@stardust/core/global/entities'
import { Slug } from '@stardust/core/global/structures'
import { Star } from '@stardust/core/space/entities'

import { isFirstStarOfCurrentGalaxy } from './isFirstStarOfCurrentGalaxy'

type Request = {
  starSlug: string
}

type Response = StarDto

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
      if (user.hasUnlockedStar(star.id).isFalse) {
        const isFirstStar = await isFirstStarOfCurrentGalaxy(service, star.id)
        if (!isFirstStar) call.notFound()
      }

      return star.dto
    },
  }
}
