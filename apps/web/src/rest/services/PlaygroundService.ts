import type { PlaygroundService as IPlaygroundService } from '@stardust/core/playground/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Snippet } from '@stardust/core/playground/entities'
import type { Id, Text } from '@stardust/core/global/structures'
import type { PaginationParams } from '@stardust/core/global/types'

export const PlaygroundService = (restClient: RestClient): IPlaygroundService => {
  return {
    fetchSnippetById(snippetId: Id) {
      return restClient.get(`/playground/snippets/${snippetId.value}`)
    },

    fetchSnippetsList(params: PaginationParams) {
      restClient.setQueryParam('page', params.page.value.toString())
      restClient.setQueryParam('itemsPerPage', params.itemsPerPage.value.toString())
      return restClient.get('/playground/snippets')
    },

    createSnippet(snippet: Snippet) {
      return restClient.post('/playground/snippets', snippet.dto)
    },

    updateSnippet(snippet: Snippet) {
      return restClient.put(`/playground/snippets/${snippet.id.value}`, snippet.dto)
    },

    editSnippetTitle(snippetId: Id, snippetTitle: Text) {
      return restClient.patch(`/playground/snippets/${snippetId.value}`, {
        title: snippetTitle.value,
      })
    },

    deleteSnippet(snippetId: Id) {
      return restClient.delete(`/playground/snippets/${snippetId.value}`)
    },
  }
}
