import type { EventPayload } from '@stardust/core/global/types'
import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { ShopService } from '@stardust/core/shop/interfaces'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { GetAcquirableShopItemsByDefaultUseCase } from '@stardust/core/shop/use-cases'
import type { FirstStarUnlockedEvent } from '@stardust/core/space/events'

type UserCreatedEventPayload = EventPayload<typeof UserCreatedEvent>
type FirstStarUnlockedEventPayload = EventPayload<typeof FirstStarUnlockedEvent>

export const handleFirstStarUnlockedJob = (service: ShopService): Job => {
  async function saveAcquiredAvatar(avatarId: string, userId: string) {
    const response = await service.saveAcquiredAvatar(avatarId, userId)
    if (response.isFailure) response.throwError()
  }

  async function saveAcquiredRocket(rocketId: string, userId: string) {
    const response = await service.saveAcquiredRocket(rocketId, userId)
    if (response.isFailure) response.throwError()
  }

  return {
    async handle(queue: Amqp<FirstStarUnlockedEventPayload>) {
      const useCase = new GetAcquirableShopItemsByDefaultUseCase(service)
      const {
        selectedRocketByDefaultId,
        selectedAvatarByDefaultId,
        acquirableAvatarsByDefaultIds,
        acquirableRocketsByDefaultIds,
      } = await queue.run<ReturnType<typeof useCase.do>>(
        async () => useCase.do(),
        GetAcquirableShopItemsByDefaultUseCase.name,
      )
      const { user } = queue.getPayload()

      const event = new ShopItemsAcquiredByDefaultEvent({
        user,
        selectedAvatarByDefaultId,
        selectedRocketByDefaultId,
      })
      await queue.publish(event)

      const { userId } = await queue.waitFor<UserCreatedEventPayload>(
        UserCreatedEvent._NAME,
        '20s',
      )

      if (userId)
        await queue.run(async () => {
          await Promise.all([
            ...acquirableAvatarsByDefaultIds.map((avatarId) =>
              saveAcquiredAvatar(avatarId, userId),
            ),
            ...acquirableRocketsByDefaultIds.map((rocketId) =>
              saveAcquiredRocket(rocketId, userId),
            ),
          ])
        }, 'save acquired shop items')
    },
  }
}
