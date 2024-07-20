import { RankingUser, User } from '@/@core/domain/entities'
import type { RankingUserDTO, TierDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IRankingsService } from '@/@core/interfaces/services'

type Response = Promise<{
  isUserLoser: boolean
  lastWeekTier: TierDTO
  lastWeekRankingWinners: RankingUserDTO[]
}>

export class GetLastWeekRankingWinnersUseCase implements IUseCase<UserDTO, Response> {
  constructor(private rankingsService: IRankingsService) {}

  async do(userDTO: UserDTO) {
    const user = User.create(userDTO)

    const lastWeekTier = await this.fetchLastWeekTier(user)

    const [isUserLoser, lastWeekRankingWinners] = await Promise.all([
      this.checkRankingLoserState(user.id),
      this.fetchLastWeekRankingWinners(lastWeekTier.id),
    ])

    return {
      isUserLoser,
      lastWeekTier,
      lastWeekRankingWinners,
    }
  }

  private async fetchLastWeekTier(user: User) {
    const response = await this.rankingsService.fetchLastWeekTier(user.id)
    if (response.isSuccess) return response.data

    return user.tier.dto
  }

  private orderRankingWinnersAsPodium(rankingWinners: RankingUser[]) {
    rankingWinners.sort((a: RankingUser, b: RankingUser) => {
      const previousPosition = a.rankingPosition.position.value
      const nextPosition = b.rankingPosition.position.value

      if (previousPosition === 2) {
        return -1
      }
      if (previousPosition === 1) {
        return nextPosition === 2 ? 1 : -1
      }
      if (previousPosition === 3) {
        return nextPosition === 2 || nextPosition === 1 ? 1 : -1
      }

      return 1
    })

    return rankingWinners.map((rankingWinner) => rankingWinner.dto)
  }

  private async fetchLastWeekRankingWinners(lastWeekTierId: string) {
    const response = await this.rankingsService.fetchRankingWinnersByTier(lastWeekTierId)

    if (response.isFailure) {
      return []
    }

    const rankingWinners = response.data.map((dto, index) =>
      RankingUser.create(dto, index + 1)
    )

    return this.orderRankingWinnersAsPodium(rankingWinners)
  }

  private async checkRankingLoserState(userId: string) {
    const response = await this.rankingsService.checkRankingLoserState(userId)

    if (response.isFailure) {
      return false
    }

    return response.data
  }
}
