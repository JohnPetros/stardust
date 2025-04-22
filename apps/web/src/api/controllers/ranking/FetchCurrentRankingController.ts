import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type {
  IController,
  IHttp,
  IRankingService,
} from '@stardust/core/global/interfaces'

export const FetchCurrentRankingController = (service: IRankingService): IController => {
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
