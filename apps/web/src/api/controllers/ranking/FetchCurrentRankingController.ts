import type {
  IController,
  IHttp,
  IProfileService,
  IRankingService,
} from '@stardust/core/interfaces'
import type { IAuthService } from '@stardust/core/interfaces'

export const FetchCurrentRankingController = (
  authService: IAuthService,
  profileService: IProfileService,
  rankingService: IRankingService,
): IController => {
  return {
    async handle(http: IHttp) {
      const userIdResponse = await authService.fetchUserId()
      if (userIdResponse.isFailure) userIdResponse.throwError()

      const userResponse = await profileService.fetchUserById(userIdResponse.body)
      if (userResponse.isFailure) userResponse.throwError()

      const [tiersResponse, rankingUsersResponse] = await Promise.all([
        rankingService.fetchTiers(),
        rankingService.fetchRankingUsersByTier(userResponse.body.tier.id),
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
