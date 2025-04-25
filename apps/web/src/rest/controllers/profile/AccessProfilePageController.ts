import { ROUTES } from '@/constants'
import { User } from '@stardust/core/global/entities'
import type { IController, IHttp } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    userId: string
  }
}

export const AccessProfilePageController = (
  service: ProfileService,
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
