import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  RankersRepository,
  TiersRepository,
} from '@stardust/core/ranking/interfaces'
import { GetRankingUseCase } from '@stardust/core/ranking/use-cases'

type Schema = {
  routeParams: {
    tierId: string
  }
}

export class FetchRankingController implements Controller<Schema> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { tierId } = http.getRouteParams()
    const useCase = new GetRankingUseCase(this.tiersRepository, this.rankersRepository)
    const response = await useCase.execute({ tierId })
    return http.send(response.rankers)
  }
}
