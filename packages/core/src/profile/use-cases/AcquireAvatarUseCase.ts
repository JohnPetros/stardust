import type { Logical } from '#global/domain/structures/Logical'
import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../domain/errors'
import { AvatarAggregate } from '../domain/aggregates'
import type { User } from '../domain/entities'
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

export class AcquireAvatarUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction(request: Request) {
    const user = await this.findUser(Id.create(request.userId))
    const avatar = this.createAvatar(request)
    await this.acquire(user, avatar, request)
    return user.dto
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private createAvatar(request: Request) {
    const { avatarName: name, avatarImage: image } = request
    const entity = name && image ? { name, image } : undefined
    return AvatarAggregate.create({ id: request.avatarId, entity })
  }

  private async acquire(user: User, avatar: AvatarAggregate, request: Request) {
    const price = Integer.create(request.avatarPrice)
    const canAcquire = this.canAcquire(user, avatar, price)
    await this.persistOwnership(user.id, avatar.id, canAcquire)
    await this.persistAcquisition(user, avatar, price)
    if (canAcquire.isTrue) await this.publishPurchase(user.id, avatar.id, request)
  }

  private publishPurchase(userId: Id, itemId: Id, request: Request) {
    const payload = {
      ...this.purchaseItem(request),
      userId: userId.value,
      itemId: itemId.value,
    }
    return this.broker.publish(new ShopItemPurchasedEvent(payload))
  }

  private purchaseItem(request: Request) {
    return {
      itemType: 'avatar',
      itemName: request.avatarName,
      itemPrice: request.avatarPrice,
    } as const
  }

  private canAcquire(user: User, avatar: AvatarAggregate, price: Integer) {
    return user.canAcquire(price).andNot(user.hasAcquiredAvatar(avatar.id))
  }

  private async persistAcquisition(user: User, avatar: AvatarAggregate, price: Integer) {
    user.acquireAvatar(avatar, price)
    await this.repository.replace(user)
  }
  private async persistOwnership(userId: Id, itemId: Id, canAcquire: Logical) {
    if (canAcquire.isTrue) await this.repository.addAcquiredAvatar(itemId, userId)
  }
}
