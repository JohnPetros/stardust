import { Avatar } from '@stardust/core/shop/entities'
import type { DrizzleAvatar, DrizzleInsertAvatar } from '../../types/entities/shop'

export class DrizzleAvatarMapper {
  static toEntity(row: DrizzleAvatar): Avatar {
    return Avatar.create({
      id: row.id,
      ...DrizzleAvatarMapper.readCatalog(row),
      isPurchasable: row.isPurchasable,
      isAcquiredByDefault: row.isAcquiredByDefault,
      isSelectedByDefault: row.isSelectedByDefault,
    })
  }
  static toPersistence(entity: Avatar): DrizzleInsertAvatar {
    return {
      id: entity.id.value,
      ...DrizzleAvatarMapper.writeCatalog(entity),
      isAcquiredByDefault: entity.dto.isAcquiredByDefault ?? false,
      isSelectedByDefault: entity.dto.isSelectedByDefault ?? false,
    }
  }

  private static readCatalog(
    row: DrizzleAvatar,
  ): Pick<DrizzleAvatar, 'name' | 'image' | 'price'> {
    const { name, image, price } = row
    return { name, image, price }
  }

  private static writeCatalog(
    entity: Avatar,
  ): Pick<DrizzleInsertAvatar, 'name' | 'image' | 'price'> {
    const { name, image, price } = entity.dto
    return { name, image, price }
  }
}
