import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type {
  IAction,
  IActionServer,
  IAuthService,
  IQueue,
} from '@stardust/core/interfaces'

type Request = {
  name: string
  email: string
  password: string
}

export const SignUpAction = (
  authService: IAuthService,
  queue: IQueue,
): IAction<Request> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { email, name, password } = actionServer.getRequest()
      const response = await authService.signUp(email, password)
      if (response.isFailure) response.throwError()

      const event = new UserSignedUpEvent({
        userId: response.body.userId,
        userEmail: email,
        userName: name,
      })
      await queue.publish(event)
    },
  }
}
