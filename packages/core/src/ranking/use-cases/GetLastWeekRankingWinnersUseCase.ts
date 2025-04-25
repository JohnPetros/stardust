import { User } from '../../global/domain/entities'
import type { UserDto } from '../../global/dtos'
import type { RankingService, UseCase } from '../../global/interfaces'
import type { RankingUserDto, TierDto } from '../dtos'
import { Tier } from '../domain/entities'

type Response = Promise<{
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}>

export class GetLastWeekRankingWinnersUseCase implements UseCase<UserDto, Response> {
  constructor(private rankingsService: RankingService) {}

  async do(userDto: UserDto) {
    const user = User.create(userDto)
    const lastWeekTierPosition = await this.fetchLastWeekTierPosition(user)
    const lastWeekTier = await this.fetchLastWeekTier(lastWeekTierPosition)
    const lastWeekRankingWinners = await this.fetchLastWeekRankingWinners(
      lastWeekTier.id.value,
    )
    const isUserLoser = user.tier.position.isLessThan(lastWeekTier.position)

    return {
      isUserLoser: isUserLoser.isTrue,
      lastWeekTier: lastWeekTier.dto,
      lastWeekRankingWinners,
    }
  }

  private async fetchLastWeekTier(tierPosition: number) {
    const response = await this.rankingsService.fetchTierByPosition(tierPosition)
    if (response.isFailure) response.throwError()
    return Tier.create(response.body)
  }

  private async fetchLastWeekRankingWinners(lastWeekTierId: string) {
    const response = await this.rankingsService.fetchRankingWinnersByTier(lastWeekTierId)
    if (response.isSuccess) {
      return response.body
    }
    return []
  }

  private async fetchLastWeekTierPosition(user: User) {
    const response = await this.rankingsService.fetchLastWeekRankingUserTierPosition(
      user.id.value,
    )
    if (response.isFailure) return user.tier.position.value
    return response.body.position
  }
}
