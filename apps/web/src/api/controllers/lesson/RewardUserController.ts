import { HTTP_STATUS_CODE } from '@stardust/core/constants'
import type { RewardingPayloadOrigin } from '@/@core/domain/types'
import type { RewardingPayloadDto } from '#dtos'
import type { IController, IHttp } from '@stardust/core/interfaces'
import type {
  IAuthService,
  IUsersService,
  ISpaceService,
} from '@stardust/core/interfaces'
import { RewardUserUseCase } from '@/@core/use-cases/users'
import { ROUTES } from '@/constants'

export const RewardUserController = (
  authService: IAuthService,
  usersService: IUsersService,
  spaceService: ISpaceService,
): IController => {
  function getNextRoute(rewardPayloadOrigin: RewardingPayloadOrigin) {
    switch (rewardPayloadOrigin) {
      case 'star':
        return ROUTES.private.app.home.space
      default:
        return ROUTES.private.app.home.space
    }
  }

  return {
    async handle(http: IHttp) {
      const rewardingPayloadDto = await http.getBody<RewardingPayloadDto>()

      const userIdResponse = await authService.fetchUserId()
      if (userIdResponse.isFailure) {
        return http.send(userIdResponse.errorMessage, HTTP_STATUS_CODE.badRequest)
      }

      const userResponse = await usersService.fetchUserById(userIdResponse.body)
      if (userResponse.isFailure) {
        return http.send(userResponse.errorMessage, HTTP_STATUS_CODE.serverError)
      }

      const useCase = new RewardUserUseCase(usersService, spaceService)

      try {
        const response = await useCase.do({
          userDto: userResponse.body,
          rewardingPayloadDto,
        })

        const nextRoute = getNextRoute(response.origin)

        return http.send(
          {
            nextRoute,
            newLevel: response.newLevel,
            newCoins: response.newCoins,
            newXp: response.newXp,
            time: response.time,
            accuracyPercentage: response.accuracyPercentage,
          },
          HTTP_STATUS_CODE.ok,
        )
      } catch (error) {
        return http.send(error.message, HTTP_STATUS_CODE.badRequest)
      }
    },
  }
}
