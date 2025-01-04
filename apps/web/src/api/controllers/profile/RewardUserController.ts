import { HTTP_STATUS_CODE } from '@stardust/core/constants'
import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IProfileService, ISpaceService } from '@stardust/core/interfaces'
import type { RewardingPayloadOrigin } from '@stardust/core/lesson/types'
import { RewardUserUseCase } from '@stardust/core/profile/use-cases'
import type { RewardingPayloadDto } from '@stardust/core/global/dtos'

import { ROUTES } from '@/constants'

type Schema = {
  body: RewardingPayloadDto
}

export const RewardUserController = (
  profileService: IProfileService,
  spaceService: ISpaceService,
): IController => {
  function getNextRoute(rewardPayloadOrigin: RewardingPayloadOrigin) {
    switch (rewardPayloadOrigin) {
      case 'star':
        return ROUTES.space
      default:
        return ROUTES.space
    }
  }

  return {
    async handle(http: IHttp<Schema>) {
      const rewardingPayloadDto = http.getBody()
      const userDto = await http.getUser()

      const useCase = new RewardUserUseCase(profileService, spaceService)

      const response = await useCase.do({
        userDto: userDto,
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
    },
  }
}
