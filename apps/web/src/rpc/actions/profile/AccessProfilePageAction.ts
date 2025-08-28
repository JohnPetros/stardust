import { Slug } from '@stardust/core/global/structures'
import type { Action, Call } from '@stardust/core/global/interfaces'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'

type Request = {
  userSlug: string
}

type Response = UserDto

export const AccessProfilePageAction = (
  service: ProfileService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { userSlug } = call.getRequest()
      console.log('userSlug', userSlug)
      const reponse = await service.fetchUserBySlug(Slug.create(userSlug))
      if (reponse.isFailure) call.notFound()
      return reponse.body
    },
  }
}
