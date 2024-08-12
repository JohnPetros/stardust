import type { Planet } from '@/@core/domain/entities'
import type { PlanetDTO, StarDTO } from '@/@core/dtos'
import type { ISpaceService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'

export class SpaceServiceMock implements ISpaceService {
  planets: PlanetDTO[] = []
  stars: StarDTO[] = []
  unlockedStarsIds: string[] = []

  async fetchPlanets(): Promise<ServiceResponse<PlanetDTO[]>> {
    return new ServiceResponse(this.planets)
  }

  async fetchPlanetByStar(starId: string): Promise<ServiceResponse<PlanetDTO>> {
    const planet = this.planets.find((planet) =>
      planet.stars.some((star) => star.id === starId),
    )
    if (planet) return new ServiceResponse(planet)
    return new ServiceResponse<PlanetDTO>(null)
  }

  async savePlanet(planet: Planet): Promise<ServiceResponse<true>> {
    this.planets.push(planet.dto)
    return new ServiceResponse(true)
  }

  async fetchStarBySlug(starSlug: string): Promise<ServiceResponse<StarDTO>> {
    const star = this.stars.find((star) => star.slug === starSlug)
    if (star) return new ServiceResponse(star)
    return new ServiceResponse<StarDTO>(null)
  }

  async fetchStarById(starId: string): Promise<ServiceResponse<StarDTO>> {
    const star = this.stars.find((star) => star.id === starId)
    if (star) return new ServiceResponse(star)
    return new ServiceResponse<StarDTO>(null)
  }

  async fetchNextStarFromNextPlanet(
    currentPlanet: Planet,
  ): Promise<ServiceResponse<StarDTO>> {
    const planet = this.planets.find(
      (planet) => planet.position === currentPlanet.position.incrementOne().value,
    )
    if (planet) return new ServiceResponse(planet.stars[0])
    return new ServiceResponse<StarDTO>(null)
  }

  async verifyStarIsUnlocked(
    starId: string,
    userId: string,
  ): Promise<ServiceResponse<boolean>> {
    throw new Error('Method not implemented.')
  }

  async saveUserUnlockedStar(
    starId: string,
    userId: string,
  ): Promise<ServiceResponse<boolean>> {
    this.unlockedStarsIds.push(starId)
    return new ServiceResponse(true)
  }
}
