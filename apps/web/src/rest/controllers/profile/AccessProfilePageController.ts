import { ROUTES } from '@/constants'
import { User } from '@stardust/core/global/entities'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { AccountProvider, Id } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

type Schema = {
  routeParams: {
    userId: string
  }
}

export const AccessProfilePageController = (
  service: ProfileService,
): Controller<Schema> => {
  return {
    async handle(http: Http<Schema>) {
      const { userId } = http.getRouteParams()
      const response = await service.fetchUserById(
        Id.create(userId),
        AccountProvider.createAsEmail(),
      )
      if (response.isFailure) response.throwError()
      const user = User.create(response.body)
      return http.redirect(ROUTES.profile.user(user.slug.value))
    },
  }
}
