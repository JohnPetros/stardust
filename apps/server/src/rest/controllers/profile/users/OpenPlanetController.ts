import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { OpenPlanetUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    planetId: string
  }
}

export class OpenPlanetController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const userId = await http.getAccountId()
    const { planetId } = http.getRouteParams()
    const useCase = new OpenPlanetUseCase(this.usersRepository)
    const response = await useCase.execute({ userId, planetId })
    return http.send(response)
  }
}
