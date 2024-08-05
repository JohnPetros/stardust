import { HTTP_STATUS_CODE } from '@/@core/constants'
import type { RewardingPayloadOrigin } from '@/@core/domain/types'
import type { RewardingPayloadDTO } from '@/@core/dtos'
import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type {
  IAuthService,
  IUsersService,
  ISpaceService,
} from '@/@core/interfaces/services'
import { RewardUserUseCase } from '@/@core/use-cases/users'
import { ROUTES } from '@/ui/global/constants'

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
      const rewardingPayloadDTO = await http.getBody<RewardingPayloadDTO>()

      const userIdResponse = await authService.fetchUserId()
      if (userIdResponse.isFailure) {
        return http.send(userIdResponse.errorMessage, HTTP_STATUS_CODE.badRequest)
      }

      const userResponse = await usersService.fetchUserById(userIdResponse.data)
      if (userResponse.isFailure) {
        return http.send(userResponse.errorMessage, HTTP_STATUS_CODE.serverError)
      }

      const useCase = new RewardUserUseCase(usersService, spaceService)

      try {
        const response = await useCase.do({
          userDTO: userResponse.data,
          rewardingPayloadDTO,
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
