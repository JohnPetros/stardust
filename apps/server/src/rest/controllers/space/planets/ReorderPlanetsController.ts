import { ReorderPlanetsUseCase } from '@stardust/core/space/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  body: {
    planetIds: string[]
  }
}

export class ReorderPlanetsController implements Controller<Schema> {
  constructor(private readonly planetsRepository: PlanetsRepository) {}

  async handle(http: Http<Schema>) {
    const { planetIds } = await http.getBody()
    const useCase = new ReorderPlanetsUseCase(this.planetsRepository)
    const response = await useCase.execute({ planetIds })
    return http.statusOk().send(response)
  }
}
