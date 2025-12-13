import type { Insignia } from '../domain/entities'
import type { Id } from '#global/domain/structures/Id'
import type { InsigniaRole } from '#global/domain/structures/index'

export interface InsigniasRepository {
  findById(insigniaId: Id): Promise<Insignia | null>
  findAll(): Promise<Insignia[]>
  findByRole(role: InsigniaRole): Promise<Insignia | null>
  add(insignia: Insignia): Promise<void>
  replace(insignia: Insignia): Promise<void>
  remove(insigniaId: Id): Promise<void>
}
