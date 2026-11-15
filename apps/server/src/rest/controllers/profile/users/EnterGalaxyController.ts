import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { GalaxyAggregateDto } from '@stardust/core/profile/aggregates/dtos'
import { EnterGalaxyUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    galaxy: GalaxyAggregateDto
  }
}

export class EnterGalaxyController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>) {
    const userId = await http.getAccountId()
    const { galaxy } = await http.getBody()
    const useCase = new EnterGalaxyUseCase(this.usersRepository)
    await useCase.execute({ userId, galaxy })
    return http.statusOk().send({
      currentGalaxy: {
        id: galaxy.id,
        slug: galaxy.entity?.slug,
        name: galaxy.entity?.name,
      },
    })
  }
}
