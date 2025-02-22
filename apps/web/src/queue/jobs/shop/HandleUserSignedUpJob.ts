import type { IJob, IQueue, IShopService } from '@stardust/core/interfaces'
import { UserCreatedEvent } from '@stardust/core/profile/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { GetAcquirableShopItemsByDefaultUseCase } from '@stardust/core/shop/use-cases'

type UserCreatedPayload = ConstructorParameters<typeof UserCreatedEvent>['0']

export const HandleUserSignedUpJob = (shopService: IShopService): IJob => {
  async function saveAcquiredAvatar(avatarId: string, userId: string) {
    const response = await shopService.saveAcquiredAvatar(avatarId, userId)
    if (response.isFailure) response.throwError()
  }

  async function saveAcquiredRocket(rocketId: string, userId: string) {
    const response = await shopService.saveAcquiredRocket(rocketId, userId)
    if (response.isFailure) response.throwError()
  }

  return {
    async handle(queue: IQueue) {
      await queue.sleepFor('2s')

      const useCase = new GetAcquirableShopItemsByDefaultUseCase(shopService)
      const shopPayload = await queue.run<ReturnType<typeof useCase.do>>(
        async () => useCase.do(),
        GetAcquirableShopItemsByDefaultUseCase.name,
      )

      const event = new ShopItemsAcquiredByDefaultEvent(shopPayload)
      await queue.sleepFor('1s')
      await queue.publish(event)

      const { userId } = await queue.waitFor<UserCreatedPayload>(
        UserCreatedEvent.NAME,
        '20s',
      )

      if (userId)
        await queue.run(async () => {
          await Promise.all([
            ...shopPayload.acquirableAvatarsByDefaultIds.map((avatarId) =>
              saveAcquiredAvatar(avatarId, userId),
            ),
            ...shopPayload.acquirableRocketsByDefaultIds.map((rocketId) =>
              saveAcquiredRocket(rocketId, userId),
            ),
          ])
        }, 'save acquired shop items')
    },
  }
}
