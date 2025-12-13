import type { Id, Integer } from '#global/domain/structures/index'
import type { ManyItems } from '../../global/domain/types'
import type { Avatar } from '../domain/entities'
import type { ShopItemsListingParams } from '../domain/types'

export interface AvatarsRepository {
  findById(id: Id): Promise<Avatar | null>
  findSelectedByDefault(): Promise<Avatar | null>
  findMany(params: ShopItemsListingParams): Promise<ManyItems<Avatar>>
  findAllByPrice(price: Integer): Promise<Avatar[]>
  add(avatar: Avatar): Promise<void>
  replace(avatar: Avatar): Promise<void>
  remove(id: Id): Promise<void>
}
