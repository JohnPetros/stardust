import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { UserDto } from '../domain/entities/dtos'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../domain/errors'
import { ShopItemPurchasedEvent } from '../domain/events'

type Request = {
  userId: string
  insigniaRole: string
  insigniaPrice: number
}

type Response = Promise<UserDto>

export class AcquireInsigniaUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute({ userId, insigniaRole, insigniaPrice }: Request) {
    const user = await this.findUser(Id.create(userId))
    const role = InsigniaRole.create(insigniaRole)
    user.acquireInsignia(role, Integer.create(insigniaPrice))
    await this.repository.replace(user)
    await this.repository.addAcquiredInsignia(role, user.id)
    await this.broker.publish(
      new ShopItemPurchasedEvent({
        userId: user.id.value,
        itemId: role.value,
        itemType: 'insignia',
        itemName: role.value,
        itemPrice: insigniaPrice,
      }),
    )
    return user.dto
  }

  async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
