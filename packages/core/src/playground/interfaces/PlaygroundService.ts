import type { PaginationResponse, RestResponse } from '#global/responses'
import type { SnippetDto } from '#playground/dtos'
import type { Snippet } from '#playground/entities'
import type { SnippetsListParams } from '../domain/types'

export interface PlaygroundService {
  fetchSnippetById(snippetId: string): Promise<RestResponse<SnippetDto>>
  fetchSnippetsList(
    params: SnippetsListParams,
  ): Promise<RestResponse<PaginationResponse<SnippetDto>>>
  saveSnippet(snippet: Snippet): Promise<RestResponse>
  updateSnippet(snippet: Snippet): Promise<RestResponse>
  deleteSnippet(snippetId: string): Promise<RestResponse>
}
