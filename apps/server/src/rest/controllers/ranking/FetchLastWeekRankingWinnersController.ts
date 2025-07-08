import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  RankersRepository,
  TiersRepository,
} from '@stardust/core/ranking/interfaces'
import { GetLastWeekRankingWinnersUseCase } from '@stardust/core/ranking/use-cases'

type Schema = {
  routeParams: {
    tierId: string
  }
}

export class FetchLastWeekRankingWinnersController implements Controller<Schema> {
  constructor(
    private readonly tiersRepository: TiersRepository,
    private readonly rankersRepository: RankersRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const useCase = new GetLastWeekRankingWinnersUseCase(
      this.tiersRepository,
      this.rankersRepository,
    )
    const response = await useCase.execute({
      lastWeekTierPosition: 1,
      currentWeekTierPosition: 2,
    })
    return http.send(response.lastWeekRankingWinners)
  }
}
