import type { Doc } from '../domain/entities'

export interface DocsRepository {
  findAll(): Promise<Doc[]>
}
