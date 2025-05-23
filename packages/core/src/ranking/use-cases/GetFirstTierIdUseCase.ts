import type { UseCase } from '#global/interfaces/UseCase'
import type { RankingService } from '../interfaces'
import { Tier } from '../domain/entities'

type Reponse = Promise<{
  firstTierId: string
}>

export class GetFirstTierIdUseCase implements UseCase<void, Reponse> {
  constructor(private readonly rankingService: RankingService) {}

  async execute() {
    const response = await this.rankingService.fetchFirstTier()
    if (response.isFailure) {
      response.throwError()
    }
    const tier = Tier.create(response.body)
    return {
      firstTierId: tier.id.value,
    }
  }
}
