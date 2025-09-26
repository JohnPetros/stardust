import type { Controller, EventBroker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { CompleteSpaceUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    nextStarId: string | null
  }
}

export class CompleteSpaceController implements Controller<Schema> {
  constructor(private readonly repository: UsersRepository, private readonly eventBroker: EventBroker) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const userId = await http.getAccountId()
    const { nextStarId } = await http.getBody()
    const useCase = new CompleteSpaceUseCase(this.repository, this.eventBroker)
    await useCase.execute({ userId, nextStarId })
    return await http.pass()
  }
}
