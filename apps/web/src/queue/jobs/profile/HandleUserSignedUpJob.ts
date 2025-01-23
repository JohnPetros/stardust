import type { IJob, IProfileService, IQueue } from '@stardust/core/interfaces'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import { CreateUserUseCase } from '@stardust/core/global/use-cases'

type Payload = {
  userId: string
  userName: string
  userEmail: string
}

type SpaceEventPayload = ConstructorParameters<typeof FirstStarUnlockedEvent>['0']
type RankingEventPayload = ConstructorParameters<typeof FirstTierReachedEvent>['0']
type ShopEventPayload = ConstructorParameters<typeof ShopItemsAcquiredByDefaultEvent>['0']

export const HandleUserSignedUpJob = (profileService: IProfileService): IJob<Payload> => {
  return {
    async handle(queue: IQueue<Payload>) {
      const spacePayload = await queue.waitFor<SpaceEventPayload>(
        FirstStarUnlockedEvent.NAME,
        '1h',
      )

      const rankingPayload = await queue.waitFor<RankingEventPayload>(
        FirstTierReachedEvent.NAME,
        '1h',
      )

      const shopPayload = await queue.waitFor<ShopEventPayload>(
        ShopItemsAcquiredByDefaultEvent.NAME,
        '1h',
      )

      if (spacePayload && rankingPayload && shopPayload) {
        const { userId, userEmail, userName } = queue.getPayload()

        const useCase = new CreateUserUseCase(profileService)

        await queue.run(
          async () =>
            await useCase.do({
              userId,
              userName,
              userEmail,
              selectedAvatarByDefaultId: shopPayload.selectedAvatarByDefaultId,
              selectedRocketByDefaultId: shopPayload.selectedRocketByDefaultId,
              firstTierId: rankingPayload.firstTierId,
            }),
          CreateUserUseCase.name,
        )

        const event = new UserCreatedEvent({ userId })
        await queue.publish(event)
      }
    },
  }
}
