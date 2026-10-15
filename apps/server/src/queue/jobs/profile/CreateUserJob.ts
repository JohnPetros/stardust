import type { Database } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { Broker } from '@stardust/core/global/interfaces'
import { Name } from '@stardust/core/global/structures'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CreateUserUseCase,
  AcquireAvatarUseCase,
  AcquireRocketUseCase,
  FinishUserCreationUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

export class CreateUserJob implements Job<Payload> {
  static readonly KEY = 'profile/create.user.job'
  private readonly noopBroker: Broker = {
    publish: async () => {},
  }

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly broker: Broker,
    private readonly database: Database,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const payload = amqp.getPayload()
    await amqp.run(
      () => this.database.run(() => this.createUser(payload)),
      CreateUserUseCase.name,
    )
  }

  private async createUser(payload: Payload) {
    await this.createProfile(payload)
    await this.unlockFirstStar(payload)
    await this.acquireRockets(payload)
    await this.acquireAvatars(payload)
    await this.finishCreation(payload)
  }

  private async createProfile(payload: Payload) {
    const useCase = new CreateUserUseCase(this.usersRepository)
    await useCase.execute({
      ...this.userIdentity(payload),
      firstReachedTierId: payload.firstReachedTierId,
      selectedAvatarByDefaultId: payload.selectedAvatarByDefaultId,
      selectedRocketByDefaultId: payload.selectedRocketByDefaultId,
    })
  }

  private async unlockFirstStar(payload: Payload) {
    const useCase = this.createUnlockStarUseCase()
    await useCase.execute({
      userId: payload.user.id,
      starId: payload.firstUnlockedStarId,
    })
  }

  private async acquireRockets(payload: Payload) {
    const useCase = this.createAcquireRocketUseCase()
    for (const rocketId of payload.acquiredRocketsByDefaultIds) {
      await useCase.execute({ userId: payload.user.id, rocketId, rocketPrice: 0 })
    }
  }

  private async acquireAvatars(payload: Payload) {
    const useCase = this.createAcquireAvatarUseCase()
    for (const avatarId of payload.acquiredAvatarsByDefaultIds) {
      await useCase.execute({ userId: payload.user.id, avatarId, avatarPrice: 0 })
    }
  }

  private async finishCreation(payload: Payload) {
    const useCase = new FinishUserCreationUseCase(this.database, this.broker)
    await useCase.execute({
      ...this.userIdentity(payload),
      userSlug: Name.create(payload.user.name).slug.value,
    })
  }

  private userIdentity(payload: Payload) {
    return {
      userId: payload.user.id,
      userName: payload.user.name,
      userEmail: payload.user.email,
    }
  }

  private createUnlockStarUseCase() {
    return new UnlockStarUseCase(this.database, this.usersRepository, this.noopBroker)
  }

  private createAcquireRocketUseCase() {
    return new AcquireRocketUseCase(this.database, this.usersRepository, this.noopBroker)
  }

  private createAcquireAvatarUseCase() {
    return new AcquireAvatarUseCase(this.database, this.usersRepository, this.noopBroker)
  }
}
