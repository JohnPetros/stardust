import type { Database } from '#global/interfaces/Database'
import type { UseCase } from '#global/interfaces/UseCase'
import type { Broker } from '#global/interfaces/Broker'
import { Integer } from '#global/domain/structures/Integer'
import { Id } from '#global/domain/structures/Id'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import type { User } from '../domain/entities'
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
    private readonly database: Database,
    private readonly repository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async execute(request: Request) {
    return this.database.run(() => this.executeInTransaction(request))
  }

  private async executeInTransaction({ userId, insigniaRole, insigniaPrice }: Request) {
    const user = await this.findUser(Id.create(userId))
    const role = InsigniaRole.create(insigniaRole)
    await this.persistAcquisition(user, role, Integer.create(insigniaPrice))
    await this.publishPurchase(user.id, role, insigniaPrice)
    return user.dto
  }

  private async findUser(userId: Id) {
    const user = await this.repository.findById(userId)
    if (!user) throw new UserNotFoundError()
    return user
  }
  private publishPurchase(userId: Id, role: InsigniaRole, price: number) {
    const payload = { ...this.purchaseItem(role, price), userId: userId.value }
    return this.broker.publish(new ShopItemPurchasedEvent(payload))
  }

  private purchaseItem(role: InsigniaRole, price: number) {
    return {
      itemId: role.value,
      itemType: 'insignia',
      itemName: role.value,
      itemPrice: price,
    } as const
  }

  private async persistAcquisition(user: User, role: InsigniaRole, price: Integer) {
    user.acquireInsignia(role, price)
    await this.repository.replace(user)
    await this.repository.addAcquiredInsignia(role, user.id)
  }
}
