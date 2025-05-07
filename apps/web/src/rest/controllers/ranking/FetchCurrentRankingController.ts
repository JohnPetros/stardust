import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RankingService } from '@stardust/core/ranking/interfaces'

export const FetchCurrentRankingController = (service: RankingService): Controller => {
  return {
    async handle(http: Http) {
      const userDto = await http.getUser()
      const response = await service.fetchRankingUsersByTier(userDto.tier.id)
      if (response.isFailure) response.throwError()
      const rankingUsersDto = response.body
      return http.send(rankingUsersDto, HTTP_STATUS_CODE.ok)
    },
  }
}
