import type { Planet } from '@/@core/domain/entities'
import type { PlanetDto, StarDto } from '#dtos'
import type { ServiceResponse } from '@/@core/responses'

export interface ISpaceService {
  fetchStarBySlug(starSlug: string): Promise<ServiceResponse<StarDto>>
  fetchStarById(starId: string): Promise<ServiceResponse<StarDto>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<ServiceResponse<StarDto>>
  fetchPlanets(): Promise<ServiceResponse<PlanetDto[]>>
  fetchPlanetByStar(starId: string): Promise<ServiceResponse<PlanetDto>>
  verifyStarIsUnlocked(starId: string, userId: string): Promise<ServiceResponse<boolean>>
  savePlanet(planet: Planet): Promise<ServiceResponse<true>>
  saveUserUnlockedStar(starId: string, userId: string): Promise<ServiceResponse<boolean>>
}
