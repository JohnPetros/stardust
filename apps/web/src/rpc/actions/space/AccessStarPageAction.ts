import type { Action, Call, ISpaceService } from '@stardust/core/global/interfaces'
import type { StarDto } from '@stardust/core/space/dtos'
import { User } from '@stardust/core/global/entities'
import { Star } from '@stardust/core/space/entities'

type Request = {
  starSlug: string
}

type Response = StarDto

export const AccessStarPageAction = (
  service: ISpaceService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { starSlug } = call.getRequest()
      const user = User.create(await call.getUser())

      const starResponse = await service.fetchStarBySlug(starSlug)
      if (starResponse.isFailure) call.notFound()

      const star = Star.create(starResponse.body)
      const isStarUnlocked = user.hasUnlockedStar(star.id)
      if (isStarUnlocked.isFalse) call.notFound()

      return star.dto
    },
  }
}
