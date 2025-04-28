import type { RestResponse } from '@/global/responses'
import type { PlanetDto, StarDto } from '../domain/entities/dtos'
import type { Planet } from '../domain/entities'

export interface SpaceService {
  fetchStarBySlug(starSlug: string): Promise<RestResponse<StarDto>>
  fetchStarById(starId: string): Promise<RestResponse<StarDto>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<RestResponse<StarDto>>
  fetchFirstPlanet(): Promise<RestResponse<PlanetDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
  fetchPlanetByStar(starId: string): Promise<RestResponse<PlanetDto>>
  saveUnlockedStar(starId: string, userId: string): Promise<RestResponse<boolean>>
}
