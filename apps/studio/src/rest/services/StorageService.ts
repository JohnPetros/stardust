import type { RestClient } from '@stardust/core/global/interfaces'
import { Text } from '@stardust/core/global/structures'
import type { FilesListingParams } from '@stardust/core/storage/types'
import { RestResponse } from '@stardust/core/global/responses'
import type {
  SignedFileStorageProvider,
  StorageService as IStorageService,
} from '@stardust/core/storage/interfaces'
import type { SignedUploadUrlDto } from '@stardust/core/storage/structures/dtos'
import {
  SignedUploadUrl,
  type FileStorageFolderPath,
} from '@stardust/core/storage/structures'

export const StorageService = (
  restClient: RestClient,
  signedFileStorageProvider: SignedFileStorageProvider,
): IStorageService => {
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

    async uploadFile(folder: FileStorageFolderPath, file: File) {
      const signedUploadUrlResponse = await createSignedUploadUrl(
        folder,
        Text.create(file.name),
      )

      if (signedUploadUrlResponse.isFailure) {
        return new RestResponse({
          statusCode: signedUploadUrlResponse.statusCode,
          errorMessage: signedUploadUrlResponse.errorMessage,
        })
      }

      try {
        const signedUploadUrl = SignedUploadUrl.create(signedUploadUrlResponse.body)
        await signedFileStorageProvider.uploadFile(signedUploadUrl, file)

        return new RestResponse({
          statusCode: signedUploadUrlResponse.statusCode,
          body: {
            filename: signedUploadUrl.fileName.value,
          },
        })
      } catch (error) {
        return new RestResponse({
          statusCode: 500,
          errorMessage:
            error instanceof Error
              ? error.message
              : 'Falha ao enviar arquivo para o storage',
        })
      }
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
