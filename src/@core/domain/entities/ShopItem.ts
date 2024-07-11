import { BaseEntity, type BuyableItem } from '../abstracts'

type ShopItemProps = {
  id?: string
  buyableItem: BuyableItem
  userCoins: number
  isAcquired: boolean
}

export class ShopItem extends BaseEntity {
  private props: ShopItemProps

  private constructor(props: ShopItemProps) {
    super(props.id)
    this.props = props
  }

  static create(props: ShopItemProps) {
    return new ShopItem(props)
  }

  isBuyable() {
    return this.props.userCoins >= this.props.buyableItem.price
  }
}
