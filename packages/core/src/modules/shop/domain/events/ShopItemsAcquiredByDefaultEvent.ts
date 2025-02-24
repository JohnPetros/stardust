import type { IEvent } from '#interfaces'

type UserSignedUpPayload = {
  user: {
    id: string
    name: string
    email: string
  }
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

export class ShopItemsAcquiredByDefaultEvent implements IEvent<UserSignedUpPayload> {
  static readonly NAME = 'shop/shop.items.acquired.by.default'
  constructor(readonly payload: UserSignedUpPayload) {}

  get name() {
    return ShopItemsAcquiredByDefaultEvent.NAME
  }
}
