'use server'

import type {
  IAction,
  IActionServer,
  IAuthService,
  IProfileService,
  IRankingService,
  IShopService,
  ISpaceService,
} from '@stardust/core/interfaces'
import { AcquireShopItemsByDefaultUseCase } from '@stardust/core/shop/use-cases'
import { CreateUserUseCase } from '@stardust/core/global/use-cases'
import { UnlockFirstUserStarUseCase } from '@stardust/core/space/use-cases'

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
      const { email, password, name } = actionServer.getRequest()

      const authResponse = await authService.signUp(email, password, name)
      if (authResponse.isFailure) authResponse.throwError()

      const rankingResponse = await rankingService.fetchFirstTier()
      if (rankingResponse.isFailure) rankingResponse.throwError()

      const unlockFirstUserStarUseCase = new UnlockFirstUserStarUseCase(spaceService)
      unlockFirstUserStarUseCase.do({ userId: authResponse.body.userId })

      const acquireShopItemsByDefaultUseCase = new AcquireShopItemsByDefaultUseCase(
        shopService,
      )
      const { selectedAvatarByDefaultId, selectedRocketByDefaultId } =
        await acquireShopItemsByDefaultUseCase.do({ userId: authResponse.body.userId })

      const createUserUseCase = new CreateUserUseCase(
        profileService,
        rankingService,
        shopService,
      )

      await createUserUseCase.do({
        userId: authResponse.body.userId,
        userEmail: email,
        userName: name,
        avatarId: selectedAvatarByDefaultId,
        rocketId: selectedRocketByDefaultId,
        tierId: rankingResponse.body.id,
      })
    },
  }
}
