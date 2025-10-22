import type { SpaceService as ISpaceService } from '@stardust/core/space/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug, Text } from '@stardust/core/global/structures'
import type { Star } from '@stardust/core/space/entities'

export const SpaceService = (restClient: RestClient): ISpaceService => {
  return {
    async fetchPlanets() {
      return await restClient.get('/space/planets')
    },

    async createPlanetStar(planetId: Id, star: Star) {
      return await restClient.post(`/space/planets/${planetId.value}/stars`, star.dto)
    },

    async reorderPlanetStars(planetId: Id, starIds: Id[]) {
      return await restClient.put(`/space/planets/${planetId.value}/stars`, { starIds })
    },

    async deletePlanetStar(planetId: Id, starId: Id) {
      return await restClient.delete(
        `/space/planets/${planetId.value}/stars/${starId.value}`,
      )
    },

    async fetchStarBySlug(starSlug: Slug) {
      return await restClient.get(`/space/stars/slug/${starSlug.value}`)
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`)
    },

    async editStarName(starId: Id, name: Text) {
      return await restClient.put(`/space/stars/${starId.value}`, { name: name.value })
    },
  }
}
