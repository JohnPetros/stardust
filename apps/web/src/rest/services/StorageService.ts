import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'
import type { Text } from '@stardust/core/global/structures'

export const StorageService = (restClient: RestClient): IStorageService => {
  return {
    async listFiles(params: FilesListingParams) {
      if (params.page) restClient.setQueryParam('page', String(params.page.value))
      restClient.setQueryParam('itemsPerPage', String(params.itemsPerPage.value))
      restClient.setQueryParam('search', params.search.value)
      restClient.setQueryParam('folder', params.folder.value)
      return await restClient.get('/storage/files')
    },

    async createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text) {
      return await restClient.post('/storage/signed-upload-url', {
        folderPath: folderPath.value,
        fileName: fileName.value,
      })
    },

    async removeFile(folder: FileStorageFolderPath, fileName: Text) {
      restClient.clearQueryParams()
      restClient.setQueryParam('folder', folder.value)
      restClient.setQueryParam('fileName', fileName.value)

      try {
        return await restClient.delete('/storage/files')
      } finally {
        restClient.clearQueryParams()
      }
    },

    async searchEmbeddings(query, topK, namespace) {
      restClient.setQueryParam('query', String(query.value))
      restClient.setQueryParam('topK', String(topK.value))
      restClient.setQueryParam('namespace', namespace.value)
      return await restClient.get('/storage/embeddings')
    },
  }
}
