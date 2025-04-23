import type { SnippetDto } from '../../../playground/domain/dtos'
import type { Snippet } from '../../../playground/domain/entities'
import type { RestResponse, PaginationResponse } from '../../responses'
import type { SnippetsListParams } from '../../../playground/domain/types'

export interface IPlaygroundService {
  fetchSnippetById(snippetId: string): Promise<RestResponse<SnippetDto>>
  fetchSnippetsList(
    params: SnippetsListParams,
  ): Promise<RestResponse<PaginationResponse<SnippetDto>>>
  saveSnippet(snippet: Snippet): Promise<RestResponse>
  updateSnippet(snippet: Snippet): Promise<RestResponse>
  deleteSnippet(snippetId: string): Promise<RestResponse>
}
