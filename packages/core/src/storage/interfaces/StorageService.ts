import type { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import type { Integer, Text } from '#global/domain/structures/index'
import type { FilesListingParams } from '../types'
import type { EmbeddingNamespace, StorageFolder } from '../domain/structures'

export interface StorageService {
  listFiles(params: FilesListingParams): Promise<RestResponse<PaginationResponse<string>>>
  uploadFile(folder: StorageFolder, file: File): Promise<RestResponse<string>>
  removeFile(folder: StorageFolder, filename: Text): Promise<RestResponse>
  searchEmbeddings(
    query: Text,
    topK: Integer,
    namespace: EmbeddingNamespace,
  ): Promise<RestResponse<string[]>>
}
