import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import { User } from '@stardust/core/global/entities'
import { Id } from '@stardust/core/global/structures'

import { ROUTES } from '@/constants'

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
      const response = await service.fetchUserById(Id.create(userId))
      if (response.isFailure) response.throwError()
      const user = User.create(response.body)
      return http.redirect(ROUTES.profile.user(user.slug.value))
    },
  }
}
