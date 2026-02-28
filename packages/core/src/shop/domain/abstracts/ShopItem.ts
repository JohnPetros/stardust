import { Entity } from '../../../global/domain/abstracts'
import type { Image, Integer, Logical, Name } from '../../../global/domain/structures'
import type { ShopItemDto } from '../abstracts/dtos'

type ShopItemProps = {
  name: Name
  price: Integer
  image: Image
  isPurchasable: Logical
  isAcquiredByDefault: Logical
  isSelectedByDefault: Logical
}

export abstract class ShopItem<ItemProps = ShopItemProps> extends Entity<
  ShopItemProps & ItemProps
> {
  get name() {
    return this.props.name
  }

  get image() {
    return this.props.image
  }

  get price() {
    return this.props.price
  }

  get isPurchasable() {
    return this.props.isPurchasable
  }

  get isAcquiredByDefault() {
    return this.props.isAcquiredByDefault
  }

  get isSelectedByDefault() {
    return this.props.isSelectedByDefault
  }

  set isSelectedByDefault(value: Logical) {
    this.props.isSelectedByDefault = value
  }

  get dto(): ShopItemDto {
    return {
      id: this.id.value,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
      isPurchasable: this.isPurchasable.value,
      isAcquiredByDefault: this.isAcquiredByDefault.value,
      isSelectedByDefault: this.isSelectedByDefault.value,
    }
  }
}
