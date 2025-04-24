import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { IController, IHttp, RankingService } from '@stardust/core/global/interfaces'

export const FetchCurrentRankingController = (service: RankingService): IController => {
  return {
    async handle(http: IHttp) {
      const userDto = await http.getUser()
      const response = await service.fetchRankingUsersByTier(userDto.tier.id)
      if (response.isFailure) response.throwError()
      const rankingUsersDto = response.body
      return http.send(rankingUsersDto, HTTP_STATUS_CODE.ok)
    },
  }
}
