import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import type { RankingUserDto } from '../domain/entities/dtos'
import { TierNotFoundError } from '../domain/errors/TierNotFoundError'
import type { RankersRepository } from '../interfaces/RankersRepository'
import type { TiersRepository } from '../interfaces/TiersRepository'

type Request = {
  tierId: string
}

type Response = Promise<{
  rankers: RankingUserDto[]
}>

export class GetRankingUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
  ) {}

  async execute({ tierId }: Request) {
    const tier = await this.tiersRepository.findById(Id.create(tierId))
    if (!tier) throw new TierNotFoundError()

    const rankers = await this.rankersRepository.findAllByTierOrderedByXp(tier.id)

    return {
      rankers: rankers.map((ranker) => ranker.dto),
    }
  }
}
