import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { UserNotFoundError } from '../domain/errors'
import type { UsersRepository } from '../interfaces'

type Request = {
  userId: string
  planetId: string
}

type Response = Promise<{ openedPlanetId: string }>

export class OpenPlanetUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, planetId }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    const openedPlanetId = Id.create(planetId)
    if (user.hasOpenedPlanet(openedPlanetId).isFalse) {
      await this.repository.addOpenedPlanet(openedPlanetId, user.id)
      user.openPlanet(openedPlanetId)
    }
    return { openedPlanetId: openedPlanetId.value }
  }
}
