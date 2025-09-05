import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import { AccountProvider } from '@stardust/core/auth/structures'
import { RestResponse } from '@stardust/core/global/responses'

import { CACHE } from '@/constants'

type Request = {
  socialAccountProvider: string
}

export const DisconnectSocialAccountAction = (service: AuthService): Action<Request> => {
  return {
    async handle(call: Call<Request>) {
      const { socialAccountProvider } = call.getRequest()
      let response = new RestResponse()

      const accountProvider = AccountProvider.create(socialAccountProvider)

      switch (accountProvider.value) {
        case 'google':
          response = await service.disconnectGoogleAccount()
          break
        case 'github':
          response = await service.disconnectGithubAccount()
          break
      }

      if (response.isFailure) response.throwError()

      const cacheKey =
        accountProvider.value === 'google'
          ? CACHE.keys.googleAccountConnection
          : CACHE.keys.githubAccountConnection

      call.resetCache(cacheKey)
    },
  }
}
