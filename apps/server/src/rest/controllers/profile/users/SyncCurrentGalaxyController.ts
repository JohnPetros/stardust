import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { CurrentGalaxyDto } from '@stardust/core/space/entities/dtos'
import { EnterGalaxyUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: {
    storedGalaxyId: string | null
    currentGalaxy: CurrentGalaxyDto
  }
}

export class SyncCurrentGalaxyController implements Controller<Schema> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(http: Http<Schema>) {
    const userId = await http.getAccountId()
    const { currentGalaxy } = await http.getBody()
    const { galaxy } = currentGalaxy
    const useCase = new EnterGalaxyUseCase(this.usersRepository)
    await useCase.execute({
      userId,
      galaxy: { id: galaxy.id, entity: { name: galaxy.name, slug: galaxy.slug } },
    })
    return http.statusOk().send(currentGalaxy)
  }
}
