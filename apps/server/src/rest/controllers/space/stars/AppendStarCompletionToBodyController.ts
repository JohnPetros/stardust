import type { Controller, Http } from '@stardust/core/global/interfaces'
import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '@stardust/core/space/interfaces'
import { GetStarCompletionUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  body: {
    starId: string
    completedStarsIds: string[]
    openedPlanetsIds: string[]
  }
}

export class AppendStarCompletionToBodyController implements Controller<Schema> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { starId, completedStarsIds, openedPlanetsIds } = await http.getBody()
    const useCase = new GetStarCompletionUseCase(
      this.starsRepository,
      this.planetsRepository,
      this.galaxiesRepository,
    )
    const completion = await useCase.execute({
      starId,
      completedStarsIds,
      openedPlanetsIds,
    })
    http.extendBody(completion)
    return http.pass()
  }
}
