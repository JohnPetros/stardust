import type { Guide } from '../domain/entities'

export interface GuidesRepository {
  findAll(): Promise<Guide[]>
}
