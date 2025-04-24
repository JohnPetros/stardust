import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { Action, Call, IAuthService, Amqp } from '@stardust/core/global/interfaces'

type Request = {
  name: string
  email: string
  password: string
}

type Response = {
  userId: string
}

export const SignUpAction = (
  authService: IAuthService,
  queue: Amqp,
): Action<Request, Response> => {
  return {
    async handle(call: Call<Request>) {
      const { email, name, password } = call.getRequest()
      const response = await authService.signUp(email, password)
      if (response.isFailure) response.throwError()

      const event = new UserSignedUpEvent({
        userId: response.body.userId,
        userEmail: email,
        userName: name,
      })
      await queue.publish(event)
      return {
        userId: response.body.userId,
      }
    },
  }
}
