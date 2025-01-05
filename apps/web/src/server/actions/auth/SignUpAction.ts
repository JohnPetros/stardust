import type {
  IAction,
  IActionServer,
  IAuthService,
  IProfileService,
  IRankingService,
  IShopService,
  ISpaceService,
} from '@stardust/core/interfaces'
import { CreateUserUseCase } from '@stardust/core/global/use-cases'
import { AppError } from '@stardust/core/global/errors'

type Request = {
  name: string
  email: string
  password: string
}

type Dependencies = {
  authService: IAuthService
  profileService: IProfileService
  shopService: IShopService
  rankingService: IRankingService
  spaceService: ISpaceService
}

export const SignUpAction = ({
  authService,
  profileService,
  rankingService,
  shopService,
  spaceService,
}: Dependencies): IAction<Request> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { email, name, password } = actionServer.getRequest()
      const authResponse = await authService.signUp(email, password)
      if (authResponse.isFailure) authResponse.throwError()

      const createUserUseCase = new CreateUserUseCase({
        profileService,
        rankingService,
        shopService,
        spaceService,
      })
      await createUserUseCase.do({
        userId: authResponse.body.userId,
        userEmail: email,
        userName: name,
      })
    },
  }
}
