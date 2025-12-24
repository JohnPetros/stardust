import type { RestResponse } from '#global/responses/RestResponse'
import type { GuideDto } from '../domain/entities/dtos/GuideDto'

export interface ManualService {
  fetchAllGuides(): Promise<RestResponse<GuideDto[]>>
}
