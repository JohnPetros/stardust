import type { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { Tier } from '../domain/entities'

export interface TiersRepository {
  findAll(): Promise<Tier[]>
  findByPosition(position: OrdinalNumber): Promise<Tier | null>
}
