import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import { ReorderPlanetStarsUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository, StarsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  routeParams: {
    planetId: string
  }
  body: {
    starIds: string[]
  }
}

export class ReorderPlanetStarsController implements Controller<Schema> {
  constructor(
    private readonly planetsRepository: PlanetsRepository,
    private readonly starsRepository: StarsRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { planetId } = http.getRouteParams()
    const { starIds } = await http.getBody()
    const useCase = this.createReorderPlanetStarsUseCase()
    const response = await useCase.execute({ planetId, starIds })
    return http.statusOk().send(response)
  }

  private createReorderPlanetStarsUseCase() {
    return new ReorderPlanetStarsUseCase(
      this.database,
      this.planetsRepository,
      this.starsRepository,
      this.broker,
    )
  }
}
