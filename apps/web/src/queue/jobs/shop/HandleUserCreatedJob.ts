import type { IJob, IQueue, IShopService } from '@stardust/core/interfaces'
import { UserCreatedEvent } from '@stardust/core/profile/events'

type Payload = {
  userId: string
  acquiredRocketsIds: string[]
  acquiredAvatarsIds: string[]
}

export const HandleUserCreatedJob = (shopService: IShopService): IJob<Payload> => {
  async function saveAcquiredAvatar(avatarId: string, userId: string) {
    const response = await shopService.saveAcquiredAvatar(avatarId, userId)
    if (response.isFailure) response.throwError()
  }

  async function saveAcquiredRockets(rocketId: string, userId: string) {
    const response = await shopService.saveAcquiredRocket(rocketId, userId)
    if (response.isFailure) response.throwError()
  }

  return {
    key: UserCreatedEvent.name,
    async handle(queue: IQueue<Payload>) {
      const { userId, acquiredRocketsIds, acquiredAvatarsIds } = queue.getPayload()

      await Promise.all([
        ...acquiredAvatarsIds.map((avatarId) => saveAcquiredAvatar(avatarId, userId)),
        ...acquiredRocketsIds.map((rocketId) => saveAcquiredRockets(rocketId, userId)),
      ])
    },
  }
}
