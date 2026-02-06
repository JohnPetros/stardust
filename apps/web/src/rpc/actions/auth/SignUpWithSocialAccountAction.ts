import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { Broker } from '@stardust/core/global/interfaces'
import { Account } from '@stardust/core/auth/entities'
import { UserSignedInEvent } from '@stardust/core/auth/events'

import { COOKIES } from '@/constants'
import { SERVER_ENV } from '@/constants/server-env'

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
  broker: Broker,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { accessToken, refreshToken } = call.getRequest()
      const response = await service.fetchAccount()
      if (response.isFailure) response.throwError()

      const account = Account.create(response.body)

      const signUpResponse = await service.signUpWithSocialAccount(account)

      const event = new UserSignedInEvent({
        userId: account.id.value,
        platform: 'web',
      })

      await Promise.all([
        SERVER_ENV.mode === 'production' ? broker.publish(event) : null,
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
          signUpResponse: signUpResponse.errorMessage,
        }
      }

      return {
        account: account.dto,
        isNewAccount: signUpResponse.body.isNewAccount,
        signUpResponse: null,
      }
    },
  }
}
