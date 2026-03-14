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

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly broker: Broker,
  ) {}

  async handle(amqp: Amqp<Payload>) {
    const {
      user,
      firstReachedTierId,
      firstUnlockedStarId,
      acquiredAvatarsByDefaultIds,
      acquiredRocketsByDefaultIds,
      selectedAvatarByDefaultId,
      selectedRocketByDefaultId,
    } = amqp.getPayload()

    console.log(user)

    const createUserUseCase = new CreateUserUseCase(this.usersRepository)
    const unlockStarUseCase = new UnlockStarUseCase(this.usersRepository)
    const acquireRocketUseCase = new AcquireRocketUseCase(this.usersRepository)
    const acquireAvatarUseCase = new AcquireAvatarUseCase(this.usersRepository)
    const finishUserCreationUseCase = new FinishUserCreationUseCase(this.broker)

    await amqp.run(
      async () =>
        await createUserUseCase.execute({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          firstReachedTierId,
          selectedAvatarByDefaultId,
          selectedRocketByDefaultId,
        }),
      CreateUserUseCase.name,
    )

    await amqp.run(
      async () =>
        await unlockStarUseCase.execute({
          userId: user.id,
          starId: firstUnlockedStarId,
        }),
      UnlockStarUseCase.name,
    )

    await amqp.run(async () => {
      await Promise.all(
        acquiredRocketsByDefaultIds.map((rocketId) =>
          acquireRocketUseCase.execute({
            userId: user.id,
            rocketId,
            rocketPrice: 0,
          }),
        ),
      )
    }, AcquireRocketUseCase.name)

    await amqp.run(async () => {
      await Promise.all(
        acquiredAvatarsByDefaultIds.map((avatarId) =>
          acquireAvatarUseCase.execute({
            userId: user.id,
            avatarId,
            avatarPrice: 0,
          }),
        ),
      )
    }, AcquireAvatarUseCase.name)

    await amqp.run(
      async () =>
        await finishUserCreationUseCase.execute({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userSlug: Name.create(user.name).slug.value,
        }),
      FinishUserCreationUseCase.name,
    )
  }
}
