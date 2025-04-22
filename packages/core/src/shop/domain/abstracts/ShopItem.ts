import { Entity } from '../../../global/domain/abstracts'
import type { Image, Integer, Logical, Name } from '#global/structs'
import type { ShopItemDto } from '../../dtos'

type ShopItemProps = {
  name: Name
  price: Integer
  image: Image
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

  get isAcquiredByDefault() {
    return this.props.isAcquiredByDefault
  }

  get isSelectedByDefault() {
    return this.props.isSelectedByDefault
  }

  get dto(): ShopItemDto {
    return {
      id: this.id,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
      isAcquiredByDefault: this.isAcquiredByDefault.value,
      isSelectedByDefault: this.isSelectedByDefault.value,
    }
  }
}
