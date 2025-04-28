import type { Planet } from '../../space/domain/entities'
import type { PlanetDto, StarDto } from '../../space/domain/entities/dtos'
import type { SpaceService } from '../../global/interfaces'
import { RestResponse } from '../../global/responses'
import { HTTP_STATUS_CODE } from '../../global/constants'

export class SpaceServiceMock implements SpaceService {
  planets: PlanetDto[] = []
  stars: StarDto[] = []
  unlockedStarsIds: string[] = []

  async fetchPlanets(): Promise<RestResponse<PlanetDto[]>> {
    return new RestResponse({ body: this.planets })
  }

  async fetchFirstPlanet(): Promise<RestResponse<PlanetDto>> {
    throw new Error('Method not implemented.')
  }

  async fetchPlanetByStar(starId: string): Promise<RestResponse<PlanetDto>> {
    const planet = this.planets.find((planet) =>
      planet.stars.some((star) => star.id === starId),
    )
    if (planet) return new RestResponse({ body: planet })
    return new RestResponse<PlanetDto>()
  }

  async savePlanet(planet: Planet): Promise<RestResponse<true>> {
    this.planets.push(planet.dto)
    return new RestResponse()
  }

  async fetchStarBySlug(starSlug: string): Promise<RestResponse<StarDto>> {
    const star = this.stars.find((star) => star.slug === starSlug)
    if (star) return new RestResponse({ body: star })
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async fetchStarById(starId: string): Promise<RestResponse<StarDto>> {
    const star = this.stars.find((star) => star.id === starId)
    if (star) return new RestResponse({ body: star })
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async fetchNextStarFromNextPlanet(
    currentPlanet: Planet,
  ): Promise<RestResponse<StarDto>> {
    const planet = this.planets.find(
      (planet) => planet.position === currentPlanet.position.incrementOne().value,
    )
    if (planet) return new RestResponse({ body: planet.stars[0] })
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async verifyStarIsUnlocked(
    starId: string,
    userId: string,
  ): Promise<RestResponse<boolean>> {
    throw new Error('Method not implemented.')
  }

  async saveUnlockedStar(starId: string, userId: string): Promise<RestResponse<boolean>> {
    this.unlockedStarsIds.push(starId)
    return new RestResponse({ statusCode: HTTP_STATUS_CODE.created })
  }
}
