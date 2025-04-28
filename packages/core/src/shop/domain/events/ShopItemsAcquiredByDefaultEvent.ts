import { Event } from '@/global/domain/abstracts'

type Payload = {
  user: {
    id: string
    name: string
    email: string
  }
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

export class ShopItemsAcquiredByDefaultEvent extends Event<Payload> {
  static readonly _NAME = 'shop/shop.items.acquired.by.default'

  constructor(payload: Payload) {
    super(ShopItemsAcquiredByDefaultEvent._NAME, payload)
  }
}
