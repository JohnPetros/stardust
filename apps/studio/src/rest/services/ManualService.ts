import type { ManualService as IManualService } from '@stardust/core/manual/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { GuideCategory } from '@stardust/core/manual/structures'
import type { Id, IdsList } from '@stardust/core/global/structures'
import type { Guide } from '@stardust/core/manual/entities'

export const ManualService = (restClient: RestClient): IManualService => {
  return {
    async fetchGuidesByCategory(category: GuideCategory) {
      restClient.setQueryParam('category', category.value)
      return await restClient.get('/manual/guides')
    },

    async createGuide(category: GuideCategory, title: string) {
      return await restClient.post('/manual/guides', {
        guideTitle: title,
        guideCategory: category.value,
      })
    },

    async editGuideTitle(guide: Guide) {
      return await restClient.patch(`/manual/guides/${guide.id.value}/title`, {
        guideTitle: guide.title.value,
      })
    },

    async editGuideContent(guide: Guide) {
      return await restClient.patch(`/manual/guides/${guide.id.value}/content`, {
        guideContent: guide.content.value,
      })
    },

    async deleteGuide(guideId: Id) {
      return await restClient.delete(`/manual/guides/${guideId.value}`)
    },

    async reorderGuides(guideIds: IdsList) {
      return await restClient.patch('/manual/guides/reorder', {
        guideIds: guideIds.dto,
      })
    },
  }
}
