import type { RestResponse } from '#global/responses/RestResponse'
import type { DocDto } from '../domain/entities/dtos/DocDto'

export interface DocumentationService {
  fetchAllDocs(): Promise<RestResponse<DocDto[]>>
}
