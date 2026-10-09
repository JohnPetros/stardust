import { Insignia } from '@stardust/core/shop/entities'
import type { DrizzleInsignia, DrizzleInsertInsignia } from '../../types/entities/shop'

export class DrizzleInsigniaMapper {
  static toEntity(row: DrizzleInsignia): Insignia {
    return Insignia.create({
      id: row.id,
      ...DrizzleInsigniaMapper.readCatalog(row),
      role: row.role,
      isPurchasable: row.isPurchasable,
    })
  }
  static toPersistence(entity: Insignia): DrizzleInsertInsignia {
    return {
      id: entity.id.value,
      ...DrizzleInsigniaMapper.writeCatalog(entity),
      role: entity.role.value,
      isPurchasable: entity.dto.isPurchasable ?? false,
    }
  }

  private static readCatalog(
    row: DrizzleInsignia,
  ): Pick<DrizzleInsignia, 'name' | 'image' | 'price'> {
    const { name, image, price } = row
    return { name, image, price }
  }

  private static writeCatalog(
    entity: Insignia,
  ): Pick<DrizzleInsertInsignia, 'name' | 'image' | 'price'> {
    const { name, image, price } = entity.dto
    return { name, image, price }
  }
}
