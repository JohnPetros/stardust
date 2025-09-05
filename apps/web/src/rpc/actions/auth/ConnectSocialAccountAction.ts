import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { Text } from '@stardust/core/global/structures'
import { User } from '@stardust/core/profile/entities'

import { CLIENT_ENV } from '@/constants'
import { AccountProvider } from '@stardust/core/auth/structures'
import { RestResponse } from '@stardust/core/global/responses'

type Request = {
  socialAccountProvider: string
}

export const ConnectSocialAccountAction = (service: AuthService): Action<Request> => {
  return {
    async handle(call: Call<Request>) {
      const { socialAccountProvider } = call.getRequest()
      const user = User.create(await call.getUser())

      console.log(CLIENT_ENV)

      const returnUrl = Text.create(
        `${CLIENT_ENV.webAppUrl}/profile/${user.slug.value}/settings`,
      )

      const accountProvider = AccountProvider.create(socialAccountProvider)

      let response: RestResponse<{ signInUrl: string }> = new RestResponse()

      switch (accountProvider.value) {
        case 'google':
          response = await service.connectGoogleAccount(returnUrl)
          break
        case 'github':
          response = await service.connectGithubAccount(returnUrl)
          break
      }

      if (response.isFailure) response.throwError()

      if (response.isSuccessful) {
        call.redirect(response.body.signInUrl)
      }
    },
  }
}
