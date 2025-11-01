import { ReorderPlanetsUseCase } from '@stardust/core/space/use-cases'
import type { Controller, EventBroker, Http } from '@stardust/core/global/interfaces'
import type { PlanetsRepository } from '@stardust/core/space/interfaces'

type Schema = {
  body: {
    planetIds: string[]
  }
}

export class ReorderPlanetsController implements Controller<Schema> {
  constructor(
    private readonly repository: PlanetsRepository,
    private readonly broker: EventBroker,
  ) {}

  async handle(http: Http<Schema>) {
    const { planetIds } = await http.getBody()
    const useCase = new ReorderPlanetsUseCase(this.repository, this.broker)
    const response = await useCase.execute({ planetIds })
    return http.statusOk().send(response)
  }
}
