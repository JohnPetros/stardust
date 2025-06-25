import { Image, Integer, Logical, Name } from '../../../global/domain/structures'
import type { RocketDto } from './dtos'
import { ShopItem } from '../abstracts'

export class Rocket extends ShopItem {
  static create(dto: RocketDto): Rocket {
    return new Rocket(
      {
        name: Name.create(dto.name),
        price: Integer.create(dto.price, 'Preço do foguete'),
        image: Image.create(dto.image),
        isAcquiredByDefault: Logical.create(
          dto?.isAcquiredByDefault ?? false,
          'O foguete é adquirido por padrão?',
        ),
        isSelectedByDefault: Logical.create(
          dto?.isAcquiredByDefault ?? false,
          'O avatar é selecionado por padrão?',
        ),
      },
      dto.id,
    )
  }
}
