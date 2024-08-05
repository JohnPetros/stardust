import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type {
  IAuthService,
  IUsersService,
  IRankingsService,
} from '@/@core/interfaces/services'

export const FetchRankingPageDataController = (
  authService: IAuthService,
  usersService: IUsersService,
  rankingsService: IRankingsService
): IController => {
  return {
    async handle(http: IHttp) {
      const userIdResponse = await authService.fetchUserId()

      if (userIdResponse.isFailure) {
        return http.send(userIdResponse.errorMessage, 500)
      }

      const userResponse = await usersService.fetchUserById(userIdResponse.data)
      if (userResponse.isFailure) {
        return http.send(userResponse.errorMessage, 500)
      }

      const [tiersResponse, rankingUsersResponse] = await Promise.all([
        rankingsService.fetchTiers(),
        rankingsService.fetchRankingUsersByTier(userResponse.data.tier.id),
      ])

      if (tiersResponse.isFailure) {
        return http.send(tiersResponse.errorMessage, 500)
      }
      if (rankingUsersResponse.isFailure) {
        return http.send(tiersResponse.errorMessage, 500)
      }

      return http.send(
        {
          tiers: tiersResponse.data,
          rankingUsers: rankingUsersResponse.data,
        },
        200
      )
    },
  }
}
