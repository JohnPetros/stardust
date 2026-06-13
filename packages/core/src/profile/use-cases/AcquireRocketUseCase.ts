import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../domain/errors'
import { RocketAggregate } from '../domain/aggregates'
import type { UserDto } from '../domain/entities/dtos'
import { ShopItemPurchasedEvent } from '../domain/events'

type Request = {
  userId: string
  rocketId: string
  rocketName?: string
  rocketImage?: string
  rocketPrice: number
}

type Response = Promise<UserDto>

type RocketAggregateEntity = {
  name: string
  image: string
}

export class AcquireRocketUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userId, rocketId, rocketName, rocketImage, rocketPrice }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    let entity: RocketAggregateEntity | undefined
    if (rocketName && rocketImage) {
      entity = { name: rocketName, image: rocketImage }
    }
    const rocket = RocketAggregate.create({ id: rocketId, entity })

    const canAcquireRocket = user
      .canAcquire(Integer.create(rocketPrice))
      .andNot(user.hasAcquiredRocket(rocket.id))

    if (canAcquireRocket.isTrue) {
      await this.repository.addAcquiredRocket(rocket.id, Id.create(userId))
    }
    user.acquireRocket(rocket, Integer.create(rocketPrice))
    await this.repository.replace(user)
    if (canAcquireRocket.isTrue) {
      await this.broker.publish(
        new ShopItemPurchasedEvent({
          userId: user.id.value,
          itemId: rocket.id.value,
          itemType: 'rocket',
          itemName: rocketName,
          itemPrice: rocketPrice,
        }),
      )
    }
    return user.dto
  }
}
