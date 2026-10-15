import type { Logical } from '#global/domain/structures/Logical'
import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import type { UsersRepository } from '../interfaces'
import { UserNotFoundError } from '../domain/errors'
import { RocketAggregate } from '../domain/aggregates'
import type { User } from '../domain/entities'
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

export class AcquireRocketUseCase implements UseCase<Request, Response> {
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
    const rocket = this.createRocket(request)
    await this.acquire(user, rocket, request)
    return user.dto
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }

  private createRocket(request: Request) {
    const { rocketName: name, rocketImage: image } = request
    const entity = name && image ? { name, image } : undefined
    return RocketAggregate.create({ id: request.rocketId, entity })
  }

  private async acquire(user: User, rocket: RocketAggregate, request: Request) {
    const price = Integer.create(request.rocketPrice)
    const canAcquire = this.canAcquire(user, rocket, price)
    await this.persistOwnership(user.id, rocket.id, canAcquire)
    await this.persistAcquisition(user, rocket, price)
    if (canAcquire.isTrue) await this.publishPurchase(user.id, rocket.id, request)
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
      itemType: 'rocket',
      itemName: request.rocketName,
      itemPrice: request.rocketPrice,
    } as const
  }

  private canAcquire(user: User, rocket: RocketAggregate, price: Integer) {
    return user.canAcquire(price).andNot(user.hasAcquiredRocket(rocket.id))
  }

  private async persistAcquisition(user: User, rocket: RocketAggregate, price: Integer) {
    user.acquireRocket(rocket, price)
    await this.repository.replace(user)
  }
  private async persistOwnership(userId: Id, itemId: Id, canAcquire: Logical) {
    if (canAcquire.isTrue) await this.repository.addAcquiredRocket(itemId, userId)
  }
}
