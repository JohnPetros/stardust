import type { RestResponse } from '#global/responses/RestResponse'
import type { GuideDto } from '../domain/entities/dtos/GuideDto'
import type { GuideCategory } from '../domain/structures/GuideCategory'
import type { Guide } from '../domain/entities'
import type { Id } from '#global/domain/structures/Id'
import type { IdsList } from '#global/domain/structures/IdsList'

export interface ManualService {
  fetchGuidesByCategory(category: GuideCategory): Promise<RestResponse<GuideDto[]>>
  createGuide(category: GuideCategory, title: string): Promise<RestResponse<GuideDto>>
  editGuideTitle(guide: Guide): Promise<RestResponse<GuideDto>>
  editGuideContent(guide: Guide): Promise<RestResponse<GuideDto>>
  deleteGuide(guideId: Id): Promise<RestResponse>
  reorderGuides(guideIds: IdsList): Promise<RestResponse<void>>
}
