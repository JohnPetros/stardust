import type { UseCase } from '#global/interfaces/index'
import type { RocketsRepository } from '../interfaces/index'
import type { RocketDto } from '../domain/entities/dtos'
import { Logical } from '#global/domain/structures/index'
import { Rocket } from '../domain/entities/index'

type Request = {
  rocketDto: RocketDto
}

type Response = Promise<RocketDto>

export class CreateRocketUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ rocketDto }: Request) {
    const rocket = Rocket.create(rocketDto)
    if (rocket.isSelectedByDefault.isTrue) {
      await this.updateCurrentSelectedRocketByDefault()
    }
    await this.repository.add(rocket)
    return rocket.dto
  }

  async updateCurrentSelectedRocketByDefault(): Promise<void> {
    const rocket = await this.repository.findSelectedByDefault()
    if (rocket) {
      rocket.isSelectedByDefault = Logical.createAsFalse()
      await this.repository.replace(rocket)
    }
  }
}
