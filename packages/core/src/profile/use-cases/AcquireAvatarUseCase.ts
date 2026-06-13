import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../domain/errors'
import { AvatarAggregate } from '../domain/aggregates'
import type { UserDto } from '../domain/entities/dtos'
import { ShopItemPurchasedEvent } from '../domain/events'

type Request = {
  userId: string
  avatarId: string
  avatarName?: string
  avatarImage?: string
  avatarPrice: number
}

type Response = Promise<UserDto>

type AvatarAggregateEntity = {
  name: string
  image: string
}

export class AcquireAvatarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userId, avatarId, avatarName, avatarImage, avatarPrice }: Request) {
    const user = await this.repository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    let entity: AvatarAggregateEntity | undefined
    if (avatarName && avatarImage) {
      entity = { name: avatarName, image: avatarImage }
    }
    const avatar = AvatarAggregate.create({ id: avatarId, entity })

    const canAcquireAvatar = user
      .canAcquire(Integer.create(avatarPrice))
      .andNot(user.hasAcquiredAvatar(avatar.id))

    if (canAcquireAvatar.isTrue) {
      await this.repository.addAcquiredAvatar(avatar.id, Id.create(userId))
    }
    user.acquireAvatar(avatar, Integer.create(avatarPrice))
    await this.repository.replace(user)
    if (canAcquireAvatar.isTrue) {
      await this.broker.publish(
        new ShopItemPurchasedEvent({
          userId: user.id.value,
          itemId: avatar.id.value,
          itemType: 'avatar',
          itemName: avatarName,
          itemPrice: avatarPrice,
        }),
      )
    }
    return user.dto
  }
}
