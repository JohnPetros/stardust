import type { Planet } from '#space/entities'
import type { PlanetDto, StarDto } from '#space/dtos'
import type { ISpaceService } from '#interfaces'
import { ApiResponse } from '#responses'
import { HTTP_STATUS_CODE } from '#constants'

export class SpaceServiceMock implements ISpaceService {
  planets: PlanetDto[] = []
  stars: StarDto[] = []
  unlockedStarsIds: string[] = []

  async fetchPlanets(): Promise<ApiResponse<PlanetDto[]>> {
    return new ApiResponse({ body: this.planets })
  }

  async fetchPlanetByStar(starId: string): Promise<ApiResponse<PlanetDto>> {
    const planet = this.planets.find((planet) =>
      planet.stars.some((star) => star.id === starId),
    )
    if (planet) return new ApiResponse({ body: planet })
    return new ApiResponse<PlanetDto>()
  }

  async savePlanet(planet: Planet): Promise<ApiResponse<true>> {
    this.planets.push(planet.dto)
    return new ApiResponse()
  }

  async fetchStarBySlug(starSlug: string): Promise<ApiResponse<StarDto>> {
    const star = this.stars.find((star) => star.slug === starSlug)
    if (star) return new ApiResponse({ body: star })
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async fetchStarById(starId: string): Promise<ApiResponse<StarDto>> {
    const star = this.stars.find((star) => star.id === starId)
    if (star) return new ApiResponse({ body: star })
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async fetchNextStarFromNextPlanet(
    currentPlanet: Planet,
  ): Promise<ApiResponse<StarDto>> {
    const planet = this.planets.find(
      (planet) => planet.position === currentPlanet.position.incrementOne().value,
    )
    if (planet) return new ApiResponse({ body: planet.stars[0] })
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.notFound })
  }

  async verifyStarIsUnlocked(
    starId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    throw new Error('Method not implemented.')
  }

  async saveUserUnlockedStar(
    starId: string,
    userId: string,
  ): Promise<ApiResponse<boolean>> {
    this.unlockedStarsIds.push(starId)
    return new ApiResponse({ statusCode: HTTP_STATUS_CODE.created })
  }
}
