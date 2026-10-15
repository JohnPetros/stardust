import type { Database } from '@stardust/core/global/interfaces'
import { DrizzleUnitOfWork } from '@/database/drizzle/DrizzleUnitOfWork'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { DeleteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

import { InngestBroker } from '@/queue/inngest/InngestBroker'

type Schema = {
  routeParams: {
    challengeId: string
  }
}

export class DeleteChallengeController implements Controller<Schema> {
  constructor(
    private readonly repository: ChallengesRepository,
    private readonly database: Database = new DrizzleUnitOfWork(),
  ) {}

  async handle(http: Http<Schema>) {
    const { challengeId } = http.getRouteParams()
    const useCase = this.createDeleteChallengeUseCase()
    await useCase.execute({ challengeId })
    return http.statusNoContent().send()
  }

  private createDeleteChallengeUseCase() {
    return new DeleteChallengeUseCase(this.database, this.repository, new InngestBroker())
  }
}
