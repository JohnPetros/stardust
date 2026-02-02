import type { Action, Call, Broker } from '@stardust/core/global/interfaces'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Email } from '@stardust/core/global/structures'
import { Password } from '@stardust/core/auth/structures'

import { COOKIES } from '@/constants'
import { UserSignedInEvent } from '@stardust/core/auth/events'
import { AppError } from '@stardust/core/global/errors'
import { SERVER_ENV } from '@/constants/server-env'

type Request = {
  email: string
  password: string
}

type Response = AccountDto

export const SignInAction = (
  authService: AuthService,
  broker: Broker,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { email, password } = call.getRequest()
      const response = await authService.signIn(
        Email.create(email),
        Password.create(password),
      )
      if (response.isFailure) response.throwError()

      const session = response.body
      const userId = session.account.id
      if (!userId) throw new AppError('User ID is required')

      const event = new UserSignedInEvent({
        userId,
        platform: 'web',
      })

      await Promise.all([
        SERVER_ENV.mode === 'production' ? broker.publish(event) : null,
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
