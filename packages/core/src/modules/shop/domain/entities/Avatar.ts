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
        price: Integer.create(dto.price, 'Preço do avatar'),
        image: Image.create(dto.image),
        isAcquiredByDefault: Logical.create(
          dto?.isAcquiredByDefault ?? false,
          'O avatar é adquirido por padrão?',
        ),
        isSelectedByDefault: Logical.create(
          dto?.isAcquiredByDefault ?? false,
          'O avatar é selecionado por padrão?',
        ),
      },
      dto?.id,
    )
  }
}
