import { ROUTES } from '@/constants'
import { User } from '@stardust/core/global/entities'
import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IProfileService } from '@stardust/core/interfaces'

type Schema = {
  routeParams: {
    userId: string
  }
}

export const AccessProfilePageController = (
  service: IProfileService,
): IController<Schema> => {
  return {
    async handle(http: IHttp<Schema>) {
      const { userId } = http.getRouteParams()
      const response = await service.fetchUserById(userId)
      if (response.isFailure) response.throwError()
      const user = User.create(response.body)
      return http.redirect(ROUTES.profile.user(user.slug.value))
    },
  }
}
