import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
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
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { starId, userName, userSlug } = await http.getBody()
    const star = await this.findNextStar(starId, userName, userSlug)
    http.extendBody({ nextStarId: star?.id ?? null })
    return http.pass()
  }

  private findNextStar(starId: string, userName: string, userSlug: string) {
    return this.createGetNextStarUseCase().execute({
      userName,
      userSlug,
      currentStarId: starId,
    })
  }

  private createGetNextStarUseCase() {
    return new GetNextStarUseCase(
      this.database,
      this.starsRepository,
      this.planetsRepository,
      this.broker,
    )
  }
}
