import type { UseCase } from '#global/interfaces/index'
import type { RocketsRepository } from '../interfaces/index'
import type { RocketDto } from '../domain/entities/dtos'
import { Rocket } from '../domain/entities/index'

type Request = {
  rocketDto: RocketDto
}

type Response = Promise<RocketDto>

export class CreateRocketUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: RocketsRepository) {}

  async execute({ rocketDto }: Request) {
    const rocket = Rocket.create({
      ...rocketDto,
      isAcquiredByDefault: false,
      isSelectedByDefault: false,
    })
    await this.repository.add(rocket)
    return rocket.dto
  }
}
