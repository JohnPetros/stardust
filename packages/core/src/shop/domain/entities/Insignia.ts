import { Image } from '#global/domain/structures/Image'
import { Integer } from '#global/domain/structures/Integer'
import { Logical } from '#global/domain/structures/Logical'
import { Name } from '#global/domain/structures/Name'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { ShopItem } from '../abstracts'
import type { InsigniaDto } from './dtos/InsigniaDto'

type Props = {
  role: InsigniaRole
}

export class Insignia extends ShopItem<Props> {
  static create(dto: InsigniaDto): Insignia {
    return new Insignia(
      {
        name: Name.create(dto.name),
        price: Integer.create(dto.price, 'Preço da insígnia'),
        image: Image.create(dto.image),
        role: InsigniaRole.create(dto.role),
        isAcquiredByDefault: Logical.createAsFalse(),
        isSelectedByDefault: Logical.createAsFalse(),
      },
      dto?.id,
    )
  }

  get role() {
    return this.props.role
  }

  get dto(): InsigniaDto {
    return {
      id: this.id.value,
      name: this.name.value,
      price: this.price.value,
      image: this.image.value,
      role: this.role.value,
    }
  }
}
