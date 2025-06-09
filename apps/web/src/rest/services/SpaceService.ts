import type { SpaceService as ISpaceService } from '@stardust/core/space/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug } from '@stardust/core/global/structures'

export const SpaceService = (restClient: RestClient): ISpaceService => {
  return {
    async fetchPlanets() {
      return await restClient.get('/space/planets')
    },

    async fetchStarBySlug(starSlug: Slug) {
      return await restClient.get(`/space/stars/slug/${starSlug.value}`)
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`)
    },
  }
}
