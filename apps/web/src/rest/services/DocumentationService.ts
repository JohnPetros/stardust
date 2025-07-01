import type { RestClient } from '@stardust/core/global/interfaces'
import type { DocumentationService as IDocumentationService } from '@stardust/core/documentation/interfaces'

export const DocumentationService = (restClient: RestClient): IDocumentationService => {
  return {
    async fetchAllDocs() {
      return await restClient.get('/documentation/docs')
    },
  }
}
