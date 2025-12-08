import type { Id } from '#global/domain/structures/index'
import type { ManyItems } from '../../global/domain/types'
import type { Snippet } from '#playground/domain/entities/Snippet'
import type { SnippetsListParams } from '#playground/domain/types/SnippetsListParams'

export interface SnippetsRepository {
  findById(snippetId: Id): Promise<Snippet | null>
  findManySnippets(params: SnippetsListParams): Promise<ManyItems<Snippet>>
  add(snippet: Snippet): Promise<void>
  replace(snippet: Snippet): Promise<void>
  remove(snippetId: Id): Promise<void>
}
