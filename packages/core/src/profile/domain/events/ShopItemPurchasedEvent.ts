import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  userId: string
  itemId: string
  itemType: 'rocket' | 'avatar' | 'insignia'
  itemName?: string
  itemPrice: number
}

export class ShopItemPurchasedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/shop.item.purchased'

  constructor(readonly payload: Payload) {
    super(ShopItemPurchasedEvent._NAME, payload)
  }
}
