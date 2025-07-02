import type { PlaygroundService as IPlaygroundService } from '@stardust/core/playground/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Snippet } from '@stardust/core/playground/entities'
import type { Id } from '@stardust/core/global/structures'

export const PlaygroundService = (restClient: RestClient): IPlaygroundService => {
  return {
    fetchSnippetById(snippetId: Id) {
      return restClient.get(`/playground/snippets/${snippetId.value}`)
    },

    fetchSnippetsList() {
      return restClient.get('/playground/snippets')
    },

    createSnippet(snippet: Snippet) {
      return restClient.post('/playground/snippets', snippet)
    },

    editSnippet(snippet: Snippet) {
      return restClient.put(`/playground/snippets/${snippet.id.value}`, snippet)
    },

    deleteSnippet(snippetId: Id) {
      return restClient.delete(`/playground/snippets/${snippetId.value}`)
    },
  }
}
