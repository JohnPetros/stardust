import { User } from '../../global/domain/entities'
import type { RankingUserDto, TierDto } from '../domain/entities/dtos'
import { Tier } from '../domain/entities'
import type { UserDto } from '#profile/domain/entities/dtos/UserDto'
import type { RankingService } from '../interfaces'
import type { UseCase } from '#global/interfaces/UseCase'

type Response = Promise<{
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}>

export class GetLastWeekRankingWinnersUseCase implements UseCase<UserDto, Response> {
  constructor(private rankingsService: RankingService) {}

  async execute(userDto: UserDto) {
    const user = User.create(userDto)
    const lastWeekTierPosition = await this.fetchLastWeekTierPosition(user)
    const lastWeekTier = await this.fetchLastWeekTier(lastWeekTierPosition)
    const lastWeekRankingWinners = await this.fetchLastWeekRankingWinners(
      lastWeekTier.id.value,
    )
    const isUserLoser = user.tier.position.number.isLessThan(lastWeekTier.position.number)

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
    if (response.isSuccessful) {
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
