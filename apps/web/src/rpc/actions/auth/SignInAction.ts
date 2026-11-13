import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Email } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'

import { COOKIES } from '@/constants'

type Request = {
  email: string
  password: string
}

export type SignInActionResponse =
  | { isEmailConfirmed: true; account: AccountDto }
  | { isEmailConfirmed: false }

export const SignInAction = (
  authService: AuthService,
): Action<Request, SignInActionResponse> => {
  return {
    async handle(call: Call<Request>) {
      const { email, password } = call.getRequest()
      const response = await authService.signIn(
        Email.create(email),
        Password.create(password),
      )
      if (response.statusCode === HTTP_STATUS_CODE.forbidden) {
        return { isEmailConfirmed: false }
      }
      if (response.isFailure) response.throwError()

      const session = response.body
      await Promise.all([
        call.setCookie(
          COOKIES.accessToken.key,
          session.accessToken,
          session.durationInSeconds,
        ),
        call.setCookie(
          COOKIES.refreshToken.key,
          session.refreshToken,
          COOKIES.refreshToken.durationInSeconds,
        ),
      ])

      return { isEmailConfirmed: true, account: session.account }
    },
  }
}
