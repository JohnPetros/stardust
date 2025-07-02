import type { Id } from '#global/domain/structures/index'
import type { Snippet } from '#playground/domain/entities/Snippet'
import type { SnippetsListParams } from '#playground/domain/types/SnippetsListParams'

export interface SnippetsRepository {
  findById(snippetId: Id): Promise<Snippet | null>
  findManySnippets(params: SnippetsListParams): Promise<{
    snippets: Snippet[]
    totalSnippetsCount: number
  }>
  add(snippet: Snippet): Promise<void>
  replace(snippet: Snippet): Promise<void>
  remove(snippetId: Id): Promise<void>
}
