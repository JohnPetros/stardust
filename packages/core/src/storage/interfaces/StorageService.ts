import type { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import type { Text } from '#global/domain/structures/index'
import type { SignedUploadUrlDto } from '../domain/structures/dtos'
import type { FilesListingParams } from '../types'
import type { FileStorageFolderPath } from '../domain/structures'

export interface StorageService {
  listFiles(params: FilesListingParams): Promise<RestResponse<PaginationResponse<string>>>
  createSignedUploadUrl(
    folderPath: FileStorageFolderPath,
    fileName: Text,
  ): Promise<RestResponse<SignedUploadUrlDto>>
  removeFile(folder: FileStorageFolderPath, filename: Text): Promise<RestResponse>
}
