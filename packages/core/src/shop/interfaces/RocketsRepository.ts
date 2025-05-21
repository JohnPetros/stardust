import type { Id, Integer } from '#global/domain/structures/index'
import type { Rocket } from '../domain/entities'

export interface RocketsRepository {
  findById(id: Id): Promise<Rocket | null>
  findAllByPrice(price: Integer): Promise<Rocket[]>
}
