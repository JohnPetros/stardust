import { UserSignedUpEvent } from '@stardust/core/auth/events'
import type { IJob, IQueue, IShopService } from '@stardust/core/interfaces'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { GetAcquirableShopItemsByDefaultUseCase } from '@stardust/core/shop/use-cases'

export const HandleUserSignedUpJob = (shopService: IShopService): IJob => {
  return {
    key: 'shop/handle.user.signed.up',
    eventName: UserSignedUpEvent.name,
    async handle(queue: IQueue) {
      const useCase = new GetAcquirableShopItemsByDefaultUseCase(shopService)

      const payload = await queue.run<ReturnType<typeof useCase.do>>(
        useCase,
        GetAcquirableShopItemsByDefaultUseCase.name,
      )

      await queue.publish(new ShopItemsAcquiredByDefaultEvent(payload))
    },
  }
}
