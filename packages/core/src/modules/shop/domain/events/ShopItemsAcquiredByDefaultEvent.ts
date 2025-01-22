import type { IEvent } from '#interfaces'

type UserSignedUpPayload = {
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
  acquirableAvatarsByDefaultIds: string[]
  acquirableRocketsByDefaultIds: string[]
}

export class ShopItemsAcquiredByDefaultEvent implements IEvent<UserSignedUpPayload> {
  static readonly NAME = 'shop/shop-items-acquired-by-default'
  constructor(readonly payload: UserSignedUpPayload) {}

  get name() {
    return ShopItemsAcquiredByDefaultEvent.NAME
  }
}
