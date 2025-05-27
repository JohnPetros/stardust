import type { Id, Integer } from '#global/domain/structures/index'
import type { Rocket } from '../domain/entities'
import type { ShopItemsListingParams } from '../domain/types'

export interface RocketsRepository {
  findById(id: Id): Promise<Rocket | null>
  findMany(
    params: ShopItemsListingParams,
  ): Promise<{ rockets: Rocket[]; totalRocketsCount: number }>
  findAllByPrice(price: Integer): Promise<Rocket[]>
}
