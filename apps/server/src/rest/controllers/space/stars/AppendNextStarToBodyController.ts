import { GetNextStarUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  body: {
    starId: string
  }
}

export class AppendNextStarToBodyController implements Controller<Schema> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { starId } = await http.getBody()
    const useCase = new GetNextStarUseCase(this.starsRepository, this.planetsRepository)
    const star = await useCase.execute({ currentStarId: starId })
    http.extendBody({ nextStarId: star?.id ?? null })
    return http.pass()
  }
}
