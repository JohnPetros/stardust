import type { PaginationResponse, RestResponse } from '#global/responses'
import type { FilesListingParams } from '../types'

export interface StorageService {
  listFiles(params: FilesListingParams): Promise<RestResponse<PaginationResponse<string>>>
}
