import type { RestResponse } from '#global/responses/RestResponse'
import type { Doc } from '../domain/entities'

export interface DocumentationService {
  fetchAllDocs(): Promise<RestResponse<Doc[]>>
}
