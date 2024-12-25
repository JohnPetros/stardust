import { Image, Integer, Logical, Name } from '#global/structs'
import type { AvatarDto } from '#shop/dtos'
import { ShopItem } from '../abstracts'

export type AvatarProps = {
  name: Name
  price: Integer
  image: Image
}

export class Avatar extends ShopItem {
  static create(dto: AvatarDto): Avatar {
    return new Avatar(
      {
        name: Name.create(dto.name),
        price: Integer.create('price', dto.price),
        image: Image.create(dto.image),
        isAcquiredByDefault: Logical.create(
          'O avatar é adquirido por padrão?',
          dto.isAcquiredByDefault,
        ),
        isSelectedByDefault: Logical.create(
          'O avatar é selecionado por padrão?',
          dto.isAcquiredByDefault,
        ),
      },
      dto?.id,
    )
  }
}
