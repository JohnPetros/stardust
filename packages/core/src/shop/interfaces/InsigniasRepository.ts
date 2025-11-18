import type { Insignia } from '../domain/entities'

export interface InsigniasRepository {
  findAll(): Promise<Insignia[]>
}
