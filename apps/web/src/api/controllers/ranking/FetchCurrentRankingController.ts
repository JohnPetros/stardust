import type { IController, IHttp, IRankingService } from '@stardust/core/interfaces'

export const FetchCurrentRankingController = (
  rankingService: IRankingService,
): IController => {
  return {
    async handle(http: IHttp) {
      const userDto = await http.getUser()

      const [tiersResponse, rankingUsersResponse] = await Promise.all([
        rankingService.fetchTiers(),
        rankingService.fetchRankingUsersByTier(userDto.tier.id),
      ])

      if (tiersResponse.isFailure) tiersResponse.throwError()
      if (rankingUsersResponse.isFailure) rankingUsersResponse.throwError()

      return http.send(
        {
          tiers: tiersResponse.body,
          rankingUsers: rankingUsersResponse.body,
        },
        200,
      )
    },
  }
}
