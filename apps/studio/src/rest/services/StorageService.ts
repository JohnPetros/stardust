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

    async uploadFile(folder: FileStorageFolderPath, file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await restClient.postFormData(`/storage/files/${folder.value}`, formData)
    },

    async removeFile(folder: FileStorageFolderPath, fileName: Text) {
      return await restClient.delete(`/storage/files/${folder.value}/${fileName.value}`)
    },

    async searchEmbeddings(query, topK, namespace) {
      restClient.setQueryParam('query', String(query.value))
      restClient.setQueryParam('topK', String(topK.value))
      restClient.setQueryParam('namespace', namespace.value)
      return await restClient.get('/storage/embeddings')
    },
  }
}
