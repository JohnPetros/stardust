export type ShopItemDto = {
  id?: string
  image: string
  name: string
  price: number
  isPurchasable?: boolean
  isAcquiredByDefault?: boolean
  isSelectedByDefault?: boolean
}
