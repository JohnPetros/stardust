import type { Controller, Broker } from '@stardust/core/global/interfaces'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { CompleteSpaceUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    isLastGalaxyStar: boolean
    isFirstGalaxy: boolean
  }
}

export class CompleteSpaceController implements Controller<Schema> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const userId = await http.getAccountId()
    const { isLastGalaxyStar, isFirstGalaxy } = await http.getBody()
    const useCase = new CompleteSpaceUseCase(this.repository, this.broker)
    await useCase.execute({ userId, isLastGalaxyStar, isFirstGalaxy })
    return await http.pass()
  }
}
