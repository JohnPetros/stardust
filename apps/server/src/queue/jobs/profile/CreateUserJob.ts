import type { EventPayload } from '@stardust/core/global/types'
import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  CreateUserUseCase,
  AcquireAvatarUseCase,
  AcquireRocketUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

export class CreateUserJob implements Job<Payload> {
  static readonly KEY = 'profile/create.user.job'

  constructor(private readonly usersRepository: UsersRepository) {}

  async handle(amqp: Amqp<Payload>) {
    const {
      user,
      firstTierId,
      firstStarId,
      acquiredAvatarsByDefaultIds,
      acquiredRocketsByDefaultIds,
      selectedAvatarByDefaultId,
      selectedRocketByDefaultId,
    } = amqp.getPayload()
    const createUserUseCase = new CreateUserUseCase(this.usersRepository)
    const unlockStarUseCase = new UnlockStarUseCase(this.usersRepository)
    const acquireRocketUseCase = new AcquireRocketUseCase(this.usersRepository)
    const acquireAvatarUseCase = new AcquireAvatarUseCase(this.usersRepository)

    await amqp.run(
      async () =>
        await createUserUseCase.execute({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          firstTierId,
          selectedAvatarByDefaultId,
          selectedRocketByDefaultId,
        }),
      CreateUserUseCase.name,
    )

    await amqp.run(
      async () =>
        await unlockStarUseCase.execute({
          userId: user.id,
          starId: firstStarId,
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
  }
}
