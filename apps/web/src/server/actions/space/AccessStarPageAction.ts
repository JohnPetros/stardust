import type { IAction, IActionServer, ISpaceService } from '@stardust/core/interfaces'
import type { StarDto } from '@stardust/core/space/dtos'
import { User } from '@stardust/core/global/entities'
import { Star } from '@stardust/core/space/entities'

type Request = {
  starSlug: string
}

type Response = StarDto

export const AccessStarPageAction = (
  service: ISpaceService,
): IAction<Request, Response> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { starSlug } = actionServer.getRequest()
      const user = User.create(await actionServer.getUser())

      const starResponse = await service.fetchStarBySlug(starSlug)
      if (starResponse.isFailure) actionServer.notFound()

      const star = Star.create(starResponse.body)
      const isStarUnlocked = user.hasUnlockedStar(star.id)
      if (isStarUnlocked.isFalse) actionServer.notFound()

      return star.dto
    },
  }
}
