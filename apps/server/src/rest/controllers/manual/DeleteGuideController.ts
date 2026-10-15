import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Http, Broker } from '@stardust/core/global/interfaces'
import { DeleteGuideUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
}

export class DeleteGuideController implements Controller<Schema> {
  constructor(
    private readonly repository: GuidesRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const useCase = new DeleteGuideUseCase(this.database, this.repository, this.broker)
    await useCase.execute({ guideId })
    return http.statusNoContent().send()
  }
}
