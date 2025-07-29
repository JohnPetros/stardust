import type { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import type { FilesListingParams, StorageFolder } from '../types'
import type { Text } from '#global/domain/structures/Text'

export interface StorageService {
  listFiles(params: FilesListingParams): Promise<RestResponse<PaginationResponse<string>>>
  uploadFile(folder: StorageFolder, file: File): Promise<RestResponse<string>>
  removeFile(folder: StorageFolder, filename: Text): Promise<RestResponse>
}
