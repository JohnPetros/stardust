import type { Id, Integer } from '#global/domain/structures/index'
import type { Avatar } from '../domain/entities'
import type { ShopItemsListingParams } from '../domain/types'

export interface AvatarsRepository {
  findById(id: Id): Promise<Avatar | null>
  findMany(
    params: ShopItemsListingParams,
  ): Promise<{ avatars: Avatar[]; totalAvatarsCount: number }>
  findAllByPrice(price: Integer): Promise<Avatar[]>
}
