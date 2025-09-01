import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Account } from '@stardust/core/auth/entities'

import { COOKIES } from '@/constants'

type Request = {
  accessToken: string
  refreshToken: string
}

type Response = {
  account: AccountDto
  isNewAccount: boolean
}

export const SignUpWithSocialAccountAction = (
  service: AuthService,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { accessToken, refreshToken } = call.getRequest()
      const response = await service.fetchSocialAccount()
      if (response.isFailure) response.throwError()

      const account = Account.create(response.body)

      const signUpResponse = await service.signUpWithSocialAccount(account)

      await Promise.all([
        call.setCookie(
          COOKIES.accessToken.key,
          accessToken,
          COOKIES.accessToken.durationInSeconds,
        ),
        call.setCookie(
          COOKIES.refreshToken.key,
          refreshToken,
          COOKIES.refreshToken.durationInSeconds,
        ),
      ])

      if (signUpResponse.isFailure) {
        return {
          account: account.dto,
          isNewAccount: false,
        }
      }

      return {
        account: account.dto,
        isNewAccount: signUpResponse.body.isNewAccount,
      }
    },
  }
}
