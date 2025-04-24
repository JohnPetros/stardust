import type { Planet } from '../../../space/domain/entities'
import type { PlanetDto, StarDto } from '../../../space/dtos'
import type { RestResponse } from '../../responses'

export interface ISpaceService {
  fetchStarBySlug(starSlug: string): Promise<RestResponse<StarDto>>
  fetchStarById(starId: string): Promise<RestResponse<StarDto>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<RestResponse<StarDto>>
  fetchFirstPlanet(): Promise<RestResponse<PlanetDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
  fetchPlanetByStar(starId: string): Promise<RestResponse<PlanetDto>>
  saveUnlockedStar(starId: string, userId: string): Promise<RestResponse<boolean>>
}
