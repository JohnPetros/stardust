import type { SnippetDto } from '../../../playground/domain/dtos'
import type { Snippet } from '../../../playground/domain/entities'
import type { ApiResponse, PaginationResponse } from '../../responses'
import type { SnippetsListParams } from '../../../playground/domain/types'

export interface IPlaygroundService {
  fetchSnippetById(snippetId: string): Promise<ApiResponse<SnippetDto>>
  fetchSnippetsList(
    params: SnippetsListParams,
  ): Promise<ApiResponse<PaginationResponse<SnippetDto>>>
  saveSnippet(snippet: Snippet): Promise<ApiResponse>
  updateSnippet(snippet: Snippet): Promise<ApiResponse>
  deleteSnippet(snippetId: string): Promise<ApiResponse>
}
