import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'
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
    private readonly eventBroker: EventBroker,
  ) {}

  async handle(http: Http<Schema>) {
    const { starId, userName, userSlug } = await http.getBody()
    const useCase = new GetNextStarUseCase(
      this.starsRepository,
      this.planetsRepository,
      this.eventBroker,
    )
    const star = await useCase.execute({
      userName: userName,
      userSlug: userSlug,
      currentStarId: starId,
    })
    http.extendBody({ nextStarId: star?.id ?? null })
    return http.pass()
  }
}
