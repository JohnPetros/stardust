import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Broker, Controller, Http } from '@stardust/core/global/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { CancelTextBlocksAudioGenerationInBatchUseCase } from '@stardust/core/lesson/use-cases'

type Schema = {
  routeParams: {
    starId: string
  }
}

export class CancelTextBlocksAudioGenerationInBatchController
  implements Controller<Schema>
{
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const useCase = this.createCancelTextBlocksAudioGenerationInBatchUseCase()
    const response = await useCase.execute({ starId })
    return http.send(response, HTTP_STATUS_CODE.accepted)
  }

  private createCancelTextBlocksAudioGenerationInBatchUseCase() {
    return new CancelTextBlocksAudioGenerationInBatchUseCase(
      this.database,
      this.repository,
      this.broker,
    )
  }
}
