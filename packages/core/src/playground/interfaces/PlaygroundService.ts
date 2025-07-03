import type { Id, Text } from '#global/domain/structures/index'
import type { PaginationParams } from '#global/domain/types/PaginationParams'
import type { Snippet } from '../domain/entities'
import type { SnippetDto } from '../domain/entities/dtos'
import type { PaginationResponse, RestResponse } from '#global/responses/index'

export interface PlaygroundService {
  fetchSnippetById(snippetId: Id): Promise<RestResponse<SnippetDto>>
  fetchSnippetsList(
    params: PaginationParams,
  ): Promise<RestResponse<PaginationResponse<SnippetDto>>>
  createSnippet(snippet: Snippet): Promise<RestResponse<SnippetDto>>
  updateSnippet(snippet: Snippet): Promise<RestResponse<SnippetDto>>
  editSnippetTitle(snippetId: Id, snippetTitle: Text): Promise<RestResponse<SnippetDto>>
  deleteSnippet(snippetId: Id): Promise<RestResponse>
}
