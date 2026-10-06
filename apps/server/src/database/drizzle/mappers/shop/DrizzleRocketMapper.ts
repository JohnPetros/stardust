import { Rocket } from '@stardust/core/shop/entities'
import type { DrizzleRocket, DrizzleInsertRocket } from '../../types/entities/shop'

export class DrizzleRocketMapper {
  static toEntity(row: DrizzleRocket): Rocket {
    return Rocket.create({
      id: row.id,
      ...DrizzleRocketMapper.readCatalog(row),
      isPurchasable: row.isPurchasable,
      isAcquiredByDefault: row.isAcquiredByDefault,
      isSelectedByDefault: row.isSelectedByDefault,
    })
  }
  static toPersistence(entity: Rocket): DrizzleInsertRocket {
    return {
      id: entity.id.value,
      ...DrizzleRocketMapper.writeCatalog(entity),
      isAcquiredByDefault: entity.dto.isAcquiredByDefault ?? false,
      isSelectedByDefault: entity.dto.isSelectedByDefault ?? false,
    }
  }

  private static readCatalog(
    row: DrizzleRocket,
  ): Pick<DrizzleRocket, 'name' | 'image' | 'price'> {
    const { name, image, price } = row
    return { name, image, price }
  }

  private static writeCatalog(
    entity: Rocket,
  ): Pick<DrizzleInsertRocket, 'name' | 'image' | 'price'> {
    const { name, image, price } = entity.dto
    return { name, image, price }
  }
}
