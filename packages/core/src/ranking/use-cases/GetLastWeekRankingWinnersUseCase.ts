import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { RankingUserDto, TierDto } from '../domain/entities/dtos'
import type { RankersRepository, TiersRepository } from '../interfaces'
import { TierNotFoundError } from '../domain/errors'
import type { Tier } from '../domain/entities'

type Request = {
  currentWeekTierId: string
}

type Response = Promise<{
  isRankerLoser: boolean
  lastWeekTier: TierDto
  lastWeekRankingWinners: RankingUserDto[]
}>

export class GetLastWeekRankingWinnersUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
  ) {}

  async execute({ currentWeekTierId }: Request) {
    const currentWeekTier = await this.findCurrentWeekTier(Id.create(currentWeekTierId))
    const lastWeekTier = await this.findLastWeekTier(currentWeekTier)
    const lastWeekRankingWinners = await this.rankersRepository.findAllByTier(
      lastWeekTier.id,
    )
    const isRankerLoser = currentWeekTier.position.number.isLessThan(
      lastWeekTier.position.number,
    )

    return {
      isRankerLoser: isRankerLoser.isTrue,
      lastWeekTier: lastWeekTier.dto,
      lastWeekRankingWinners: lastWeekRankingWinners.map((ranker) => ranker.dto),
    }
  }

  private async findCurrentWeekTier(currentWeekTierId: Id) {
    const currentWeekTier = await this.tiersRepository.findById(currentWeekTierId)
    if (!currentWeekTier) throw new TierNotFoundError()
    return currentWeekTier
  }

  private async findLastWeekTier(currentWeekTier: Tier) {
    const lastWeekTierPosition = currentWeekTier.position.decrement()
    const lastWeekTier = await this.tiersRepository.findByPosition(lastWeekTierPosition)
    if (!lastWeekTier) throw new TierNotFoundError()
    return lastWeekTier
  }
}
