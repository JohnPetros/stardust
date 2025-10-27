import type { SpaceService as ISpaceService } from '@stardust/core/space/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import type { Id, Slug, Text, Logical } from '@stardust/core/global/structures'

export const SpaceService = (restClient: RestClient): ISpaceService => {
  return {
    async fetchPlanets() {
      return await restClient.get('/space/planets')
    },

    async createPlanet(planetName: Name, planetIcon: Image, planetImage: Image) {
      return await restClient.post('/space/planets', {
        name: planetName.value,
        icon: planetIcon.value,
        image: planetImage.value,
      })
    },

    async createPlanetStar(planetId: Id) {
      return await restClient.post(`/space/planets/${planetId.value}/stars`)
    },

    async updatePlanet(planet: Planet) {
      return await restClient.put(`/space/planets/${planet.id.value}`, planet.dto)
    },

    async reorderPlanets(planetIds: Id[]) {
      return await restClient.put('/space/planets/list/order', {
        planetIds: planetIds.map((planetId) => planetId.value),
      })
    },

    async reorderPlanetStars(planetId: Id, starIds: Id[]) {
      return await restClient.put(`/space/planets/${planetId.value}/stars`, {
        starIds: starIds.map((starId) => starId.value),
      })
    },

    async deletePlanetStar(planetId: Id, starId: Id) {
      return await restClient.delete(
        `/space/planets/${planetId.value}/stars/${starId.value}`,
      )
    },

    async deletePlanet(planetId: Id) {
      return await restClient.delete(`/space/planets/${planetId.value}`)
    },

    async fetchStarBySlug(starSlug: Slug) {
      return await restClient.get(`/space/stars/slug/${starSlug.value}`)
    },

    async fetchStarById(starId: Id) {
      return await restClient.get(`/space/stars/id/${starId.value}`)
    },

    async editStarName(starId: Id, name: Text) {
      return await restClient.patch(`/space/stars/${starId.value}/name`, {
        name: name.value,
      })
    },

    async editStarAvailability(starId: Id, isAvailable: Logical) {
      return await restClient.patch(`/space/stars/${starId.value}/availability`, {
        isAvailable: isAvailable.value,
      })
    },

    async editStarType(starId: Id, isChallenge: Logical) {
      return await restClient.patch(`/space/stars/${starId.value}/type`, {
        isChallenge: isChallenge.value,
      })
    },
  }
}
