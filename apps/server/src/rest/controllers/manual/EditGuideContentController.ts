import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type { Controller, Broker, Http } from '@stardust/core/global/interfaces'
import { EditGuideContentUseCase } from '@stardust/core/manual/use-cases'

type Schema = {
  routeParams: {
    guideId: string
  }
  body: {
    guideContent: string
  }
}

export class EditGuideContentController implements Controller<Schema> {
  constructor(
    private readonly repository: GuidesRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { guideId } = http.getRouteParams()
    const { guideContent } = await http.getBody()
    const useCase = this.createEditGuideContentUseCase()
    const response = await useCase.execute({ guideId, guideContent })
    return http.send(response)
  }

  private createEditGuideContentUseCase() {
    return new EditGuideContentUseCase(this.database, this.repository, this.broker)
  }
}
