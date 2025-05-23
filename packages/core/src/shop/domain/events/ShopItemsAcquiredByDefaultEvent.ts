import { Event } from '#global/domain/abstracts/index'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  selectedRocketByDefaultId: string
  selectedAvatarByDefaultId: string
  acquiredRocketsByDefaultIds: string[]
  acquiredAvatarsByDefaultIds: string[]
  firstStarId: string
  firstTierId: string
}

export class ShopItemsAcquiredByDefaultEvent extends Event<Payload> {
  static readonly _NAME = 'shop/shop.items.acquired.by.default'

  constructor(payload: Payload) {
    super(ShopItemsAcquiredByDefaultEvent._NAME, payload)
  }
}
