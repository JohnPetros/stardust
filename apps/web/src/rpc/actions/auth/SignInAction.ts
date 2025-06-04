import type { Action, Call } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Email } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'

import { COOKIES } from '@/constants'

type Request = {
  email: string
  password: string
}

type Response = AccountDto

export const SignInAction = (authService: AuthService): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { email, password } = call.getRequest()
      const response = await authService.signIn(
        Email.create(email),
        Password.create(password),
      )
      console.log('response', response)
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

      return session.account
    },
  }
}
