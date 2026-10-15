import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { Broker } from '@stardust/core/global/interfaces'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { TriggerTextBlockAudioGenerationUseCase } from '@stardust/core/lesson/use-cases'

type Schema = {
  routeParams: {
    starId: string
  }
  body: {
    blockIndex: number
    voice: string
  }
}

export class TriggerTextBlockAudioGenerationController implements Controller<Schema> {
  constructor(
    private readonly repository: TextBlocksRepository,
    private readonly broker: Broker,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { starId } = http.getRouteParams()
    const { blockIndex, voice } = await http.getBody()
    const useCase = this.createTriggerTextBlockAudioGenerationUseCase()
    const response = await useCase.execute({ starId, blockIndex, voice })
    return http.send(response, HTTP_STATUS_CODE.accepted)
  }

  private createTriggerTextBlockAudioGenerationUseCase() {
    return new TriggerTextBlockAudioGenerationUseCase(
      this.database,
      this.repository,
      this.broker,
    )
  }
}
