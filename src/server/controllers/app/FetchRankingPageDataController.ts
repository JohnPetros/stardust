import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type {
  IAuthService,
  IUsersService,
  IRankingsService,
} from '@/@core/interfaces/services'
import { ObserveRankingWinnersUseCase } from '@/@core/use-cases/rankings'

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

      const rankingsResponse = await rankingsService.fetchRankings()
      if (rankingsResponse.isFailure) {
        return http.send(rankingsResponse.errorMessage, 500)
      }

      const rankingUsersResponse = await rankingsService.fetchRankingUsers(
        userResponse.data.ranking.id
      )
      if (rankingUsersResponse.isFailure) {
        return http.send(rankingUsersResponse.errorMessage, 500)
      }

      const useCase = new ObserveRankingWinnersUseCase(usersService, rankingsService)

      const data = await useCase.do({
        rankingsDTO: rankingsResponse.data,
        userDTO: userResponse.data,
      })

      return http.send(
        {
          user: data.user,
          rankingsWinners: data.rankingWinners,
          rankingUsers: rankingUsersResponse.data,
          rankings: rankingsResponse.data,
        },
        200
      )
    },
  }
}
