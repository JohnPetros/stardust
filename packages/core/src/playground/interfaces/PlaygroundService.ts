import type { PaginationResponse, RestResponse } from '@/global/responses'
import type { Snippet } from '../domain/entities'
import type { SnippetsListParams } from '../domain/types'
import type { SnippetDto } from '../domain/dtos'

export interface PlaygroundService {
  fetchSnippetById(snippetId: string): Promise<RestResponse<SnippetDto>>
  fetchSnippetsList(
    params: SnippetsListParams,
  ): Promise<RestResponse<PaginationResponse<SnippetDto>>>
  saveSnippet(snippet: Snippet): Promise<RestResponse>
  updateSnippet(snippet: Snippet): Promise<RestResponse>
  deleteSnippet(snippetId: string): Promise<RestResponse>
}
