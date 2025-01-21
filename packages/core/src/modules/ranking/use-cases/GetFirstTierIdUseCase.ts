import type { IRankingService, IUseCase } from '#interfaces'
import { Tier } from '#ranking/entities'

type Reponse = Promise<{
  firstTierId: string
}>

export class GetFirstTierIdUseCase implements IUseCase<void, Reponse> {
  constructor(private readonly rankingService: IRankingService) {}

  async do() {
    const response = await this.rankingService.fetchFirstTier()
    if (response.isFailure) {
      response.throwError()
    }
    const tier = Tier.create(response.body)
    return {
      firstTierId: tier.id,
    }
  }
}
