'use server'

import type {
  IAction,
  IActionServer,
  IAuthService,
  IChallengingService,
  IRankingService,
  IShopService,
} from '@stardust/core/interfaces'
import { AcquireShopItemsByDefaultUseCase } from '@stardust/core/shop/use-cases'
import type { CompletedChallengesCountByDifficultyLevel } from '@stardust/core/challenging/types'

type Request = {
  name: string
  email: string
  password: string
}

export const SignUpAction = (
  authService: IAuthService,
  shopService: IShopService,
  rankingService: IRankingService,
): IAction<Request, CompletedChallengesCountByDifficultyLevel> => {
  return {
    async handle(actionServer: IActionServer<Request>) {
      const { email, password, name } = actionServer.getRequest()

      const signUpResponse = await authService.signUp(email, password, name)

      const acquireShopItemsByDefaultUseCase = new AcquireShopItemsByDefaultUseCase(
        shopService,
      )
      return await acquireShopItemsByDefaultUseCase.do()
    },
  }
}
