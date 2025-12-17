import type { UseCase } from '#global/interfaces/UseCase'
import type { RocketsRepository } from '../interfaces'
import { Id } from '#global/domain/structures/index'
import { RocketNotFoundError } from '../domain/errors'

type Request = {
  rocketId: string
}

export class DeleteRocketUseCase implements UseCase<Request> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ rocketId }: Request) {
    const rocket = await this.findRocket(Id.create(rocketId))
    await this.repository.remove(rocket.id)
  }

  async findRocket(rocketId: Id) {
    const rocket = await this.repository.findById(rocketId)
    if (!rocket) throw new RocketNotFoundError()
    return rocket
  }
}
