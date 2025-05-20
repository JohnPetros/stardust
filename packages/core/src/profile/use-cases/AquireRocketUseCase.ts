import type { UseCase } from '#global/interfaces/UseCase'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../errors'
import { RocketAggregate } from '../domain/aggregates'
import type { UserDto } from '../domain/entities/dtos'

type Request = {
  userId: string
  rocketId: string
  rocketName?: string
  rocketImage?: string
  rocketPrice: number
}

type Response = Promise<UserDto>

export class AquireRocketUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute({ userId, rocketId, rocketName, rocketImage, rocketPrice }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    let entity = undefined
    if (rocketName && rocketImage) {
      entity = { name: rocketName, image: rocketImage }
    }
    const rocket = RocketAggregate.create({ id: rocketId, entity })

    user.buyRocket(rocket, Integer.create(rocketPrice))
    await this.repository.addAcquiredRocket(rocket.id, Id.create(userId))
    return user.dto
  }
}
