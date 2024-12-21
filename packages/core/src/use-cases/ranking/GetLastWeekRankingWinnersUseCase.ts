import { User } from '#domain/entities'
import type { RankingUserDto, TierDto, UserDto } from '#dtos'
import type { IRankingsService, IUseCase } from '#interfaces'

type Response = Promise<{
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}>

export class GetLastWeekRankingWinnersUseCase implements IUseCase<UserDto, Response> {
  constructor(private rankingsService: IRankingsService) {}

  async do(userDto: UserDto) {
    const user = User.create(userDto)

    const isUserLoser = await this.verifyRankingLoserState(user.id)
    const lastWeekTier = await this.fetchLastWeekTier(user, isUserLoser)
    const lastWeekRankingWinners = await this.fetchLastWeekRankingWinners(
      lastWeekTier?.id,
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
