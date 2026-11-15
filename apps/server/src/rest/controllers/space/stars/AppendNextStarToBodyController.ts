import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import type {
  GalaxiesRepository,
  PlanetsRepository,
  StarsRepository,
} from '@stardust/core/space/interfaces'
import { GetNextStarUseCase } from '@stardust/core/space/use-cases'

type Schema = {
  body: {
    starId: string
    userName: string
    userSlug: string
  }
}

export class AppendNextStarToBodyController implements Controller<Schema> {
  constructor(
    private readonly starsRepository: StarsRepository,
    private readonly planetsRepository: PlanetsRepository,
    private readonly galaxiesRepository: GalaxiesRepository,
    private readonly broker: Broker,
  ) {}

  async handle(http: Http<Schema>) {
    const { starId, userName, userSlug } = await http.getBody()
    const useCase = new GetNextStarUseCase(
      this.starsRepository,
      this.planetsRepository,
      this.galaxiesRepository,
      this.broker,
    )
    const { nextStar, isFirstGalaxy } = await useCase.execute({
      userName,
      userSlug,
      currentStarId: starId,
    })
    http.extendBody({ nextStarId: nextStar?.id ?? null, isFirstGalaxy })
    return http.pass()
  }
}
