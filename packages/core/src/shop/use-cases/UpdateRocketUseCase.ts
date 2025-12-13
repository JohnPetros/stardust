import type { UseCase } from '#global/interfaces/index'
import type { RocketsRepository } from '../interfaces/index'
import type { RocketDto } from '../domain/entities/dtos'
import { Rocket } from '../domain/entities/index'
import { type Id, Logical } from '#global/domain/structures/index'
import { RocketNotFoundError } from '../domain/errors'

type Request = {
  rocketDto: RocketDto
}

type Response = Promise<RocketDto>

export class UpdateRocketUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ rocketDto }: Request) {
    const rocket = Rocket.create(rocketDto)
    await this.findRocket(rocket.id)
    if (rocket.isSelectedByDefault.isTrue) {
      await this.updatedCurrentSelectedRocketByDefault()
    }
    await this.repository.replace(rocket)
    return rocket.dto
  }

  async findRocket(rocketId: Id): Promise<void> {
    const rocket = await this.repository.findById(rocketId)
    if (!rocket) throw new RocketNotFoundError()
  }

  async updatedCurrentSelectedRocketByDefault(): Promise<void> {
    const rocket = await this.repository.findSelectedByDefault()
    if (rocket) {
      rocket.isSelectedByDefault = Logical.createAsFalse()
      await this.repository.replace(rocket)
    }
  }
}
