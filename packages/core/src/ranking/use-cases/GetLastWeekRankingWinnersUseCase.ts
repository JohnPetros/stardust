import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { RankingUserDto, TierDto } from '../domain/entities/dtos'
import type { RankersRepository, TiersRepository } from '../interfaces'
import { TierNotFoundError } from '../domain/errors'

type Request = {
  lastWeekTierPosition: number
  currentWeekTierPosition: number
}

type Response = Promise<{
  isUserLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}>

export class GetLastWeekRankingWinnersUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
  ) {}

  async execute({
    lastWeekTierPosition: lastWeekTierPositionValue,
    currentWeekTierPosition: currentWeekTierPositionValue,
  }: Request) {
    const lastWeekTierPosition = OrdinalNumber.create(lastWeekTierPositionValue)
    const currentWeekTierPosition = OrdinalNumber.create(currentWeekTierPositionValue)
    const lastWeekTier = await this.findLastWeekTier(lastWeekTierPosition)
    const lastWeekRankingWinners = await this.rankersRepository.findAllByTier(
      lastWeekTier.id,
    )
    const isUserLoser = currentWeekTierPosition.number.isLessThan(
      lastWeekTier.position.number,
    )

    return {
      isUserLoser: isUserLoser.isTrue,
      lastWeekTier: lastWeekTier.dto,
      lastWeekRankingWinners: lastWeekRankingWinners.map((ranker) => ranker.dto),
    }
  }

  private async findLastWeekTier(tierPosition: OrdinalNumber) {
    const tier = await this.tiersRepository.findByPosition(tierPosition)
    if (!tier) throw new TierNotFoundError()
    return tier
  }
}
