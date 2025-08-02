import type { StorageService as IStorageService } from '@stardust/core/storage/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { FilesListingParams } from '@stardust/core/storage/types'
import type { StorageFolder } from '@stardust/core/storage/structures'
import type { Text } from '@stardust/core/global/structures'

export const StorageService = (restClient: RestClient): IStorageService => {
  return {
    async listFiles(params: FilesListingParams) {
      if (params.page) restClient.setQueryParam('page', String(params.page.value))
      restClient.setQueryParam('itemsPerPage', String(params.itemsPerPage.value))
      restClient.setQueryParam('search', params.search.value)
      return await restClient.get(`/storage/${params.folder.name}`)
    },

    async uploadFile(folder: StorageFolder, file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await restClient.postFormData(`/storage/${folder.name}`, formData)
    },

    async removeFile(folder: StorageFolder, fileName: Text) {
      return await restClient.delete(`/storage/${folder.name}/${fileName.value}`)
    },
  }
}
