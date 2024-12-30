import { Image, Integer, Logical, Name } from '#global/structs'
import type { RocketDto } from '#shop/dtos'
import { ShopItem } from '../abstracts'

export class Rocket extends ShopItem {
  static create(dto: RocketDto): Rocket {
    return new Rocket(
      {
        name: Name.create(dto.name),
        price: Integer.create('price', dto.price),
        image: Image.create(dto.image),
        isAcquiredByDefault: Logical.create(
          'O foguete é adquirido por padrão?',
          dto?.isAcquiredByDefault ?? false,
        ),
        isSelectedByDefault: Logical.create(
          'O avatar é selecionado por padrão?',
          dto?.isAcquiredByDefault ?? false,
        ),
      },
      dto.id,
    )
  }
}
