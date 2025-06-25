import type { Id } from '#global/domain/structures/index'
import type { Snippet } from '../domain/entities'
import type { SnippetsListParams } from '../domain/types'
import type { SnippetDto } from '../domain/dtos'
import type { PaginationResponse, RestResponse } from '#global/responses/index'

export interface PlaygroundService {
  fetchSnippetById(snippetId: Id): Promise<RestResponse<SnippetDto>>
  fetchSnippetsList(
    params: SnippetsListParams,
  ): Promise<RestResponse<PaginationResponse<SnippetDto>>>
  saveSnippet(snippet: Snippet): Promise<RestResponse>
  updateSnippet(snippet: Snippet): Promise<RestResponse>
  deleteSnippet(snippetId: Id): Promise<RestResponse>
}
