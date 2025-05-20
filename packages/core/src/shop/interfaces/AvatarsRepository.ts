import type { Id, Integer } from '#global/domain/structures/index'
import type { Avatar } from '../domain/entities'

export interface AvatarsRepository {
  findById(id: Id): Promise<Avatar | null>
  findAllByPrice(price: Integer): Promise<Avatar[]>
}
