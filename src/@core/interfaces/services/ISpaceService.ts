import type { Planet } from '@/@core/domain/entities'
import type { PlanetDTO, StarDTO } from '@/@core/dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface ISpaceService {
  fetchStarBySlug(starSlug: string): Promise<ServiceResponse<StarDTO>>
  fetchStarById(starId: string): Promise<ServiceResponse<StarDTO>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<ServiceResponse<StarDTO>>
  fetchPlanets(): Promise<ServiceResponse<PlanetDTO[]>>
  fetchPlanetByStar(starId: string): Promise<ServiceResponse<PlanetDTO>>
  verifyStarIsUnlocked(starId: string, userId: string): Promise<ServiceResponse<boolean>>
  savePlanet(planet: Planet): Promise<ServiceResponse<true>>
  saveUserUnlockedStar(starId: string, userId: string): Promise<ServiceResponse<boolean>>
}
