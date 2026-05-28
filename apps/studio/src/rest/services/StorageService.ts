import type { RestClient } from '@stardust/core/global/interfaces'
import type { Text } from '@stardust/core/global/structures'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { SignedUploadUrlDto } from '@stardust/core/storage/structures/dtos'
import type { FileStorageFolderPath } from '@stardust/core/storage/structures'

export const StorageService = (restClient: RestClient): IStorageService => {
  async function createSignedUploadUrl(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ) {
    return await restClient.post<SignedUploadUrlDto>('/storage/signed-upload-url', {
      folderPath: folderPath.value,
      fileName: fileName.value,
    })
  }

  return {
    async listFiles(params: FilesListingParams) {
      if (params.page) restClient.setQueryParam('page', String(params.page.value))
      restClient.setQueryParam('itemsPerPage', String(params.itemsPerPage.value))
      restClient.setQueryParam('search', params.search.value)
      restClient.setQueryParam('folder', params.folder.value)
      return await restClient.get('/storage/files')
    },

    async createSignedUploadUrl(folderPath: FileStorageFolderPath, fileName: Text) {
      return await createSignedUploadUrl(folderPath, fileName)
    },

    async removeFile(folder: FileStorageFolderPath, fileName: Text) {
      restClient.setQueryParam('folder', folder.value)
      restClient.setQueryParam('fileName', fileName.value)
      return await restClient.delete('/storage/files')
    },

    async searchEmbeddings(query, topK, namespace) {
      restClient.setQueryParam('query', String(query.value))
      restClient.setQueryParam('topK', String(topK.value))
      restClient.setQueryParam('namespace', namespace.value)
      return await restClient.get('/storage/embeddings')
    },
  }
}
