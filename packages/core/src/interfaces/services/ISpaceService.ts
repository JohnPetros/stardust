import type { Planet } from '#space/entities'
import type { PlanetDto, StarDto } from '#space/dtos'
import type { ApiResponse } from '#responses'

export interface ISpaceService {
  fetchStarBySlug(starSlug: string): Promise<ApiResponse<StarDto>>
  fetchStarById(starId: string): Promise<ApiResponse<StarDto>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<ApiResponse<StarDto>>
  fetchPlanets(): Promise<ApiResponse<PlanetDto[]>>
  fetchPlanetByStar(starId: string): Promise<ApiResponse<PlanetDto>>
  verifyStarIsUnlocked(starId: string, userId: string): Promise<ApiResponse<boolean>>
  saveUserUnlockedStar(starId: string, userId: string): Promise<ApiResponse<boolean>>
}
