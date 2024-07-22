import { User } from '@/@core/domain/entities'
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

    const isUserLoser = await this.verifyRankingLoserState(user.id)
    const lastWeekTier = await this.fetchLastWeekTier(user, isUserLoser)
    const lastWeekRankingWinners = await this.fetchLastWeekRankingWinners(
      lastWeekTier?.id
    )

    return {
      isUserLoser,
      lastWeekTier,
      lastWeekRankingWinners,
    }
  }

  private async fetchLastWeekTier(user: User, isUserLoser: boolean) {
    let lastWeekTierPosition = user.tier.position.value

    if (isUserLoser && !user.tier.isFirstTier) {
      lastWeekTierPosition += 1
    }

    if (user.isRankingWinner && !user.tier.isLastTier) {
      lastWeekTierPosition -= 1
    }

    const response = await this.rankingsService.fetchTierByPosition(lastWeekTierPosition)

    if (response.isSuccess) return response.data

    return user.tier.dto
  }

  private async fetchLastWeekRankingWinners(lastWeekTierId: string) {
    const response = await this.rankingsService.fetchRankingWinnersByTier(lastWeekTierId)

    if (response.isSuccess) {
      return response.data
    }

    return []
  }

  private async verifyRankingLoserState(userId: string) {
    const response = await this.rankingsService.verifyRankingLoserState(userId)

    if (response.isFailure) {
      return false
    }

    return response.data
  }
}
