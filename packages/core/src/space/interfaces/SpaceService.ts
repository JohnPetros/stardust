import type { RestResponse } from '#global/responses/RestResponse'
import type { Id, Slug } from '#global/domain/structures/index'
import type { PlanetDto, StarDto } from '../domain/entities/dtos'
import type { Planet } from '../domain/entities'

export interface SpaceService {
  fetchStarBySlug(starSlug: Slug): Promise<RestResponse<StarDto>>
  fetchStarById(starId: Id): Promise<RestResponse<StarDto>>
  fetchNextStarFromNextPlanet(starPlanet: Planet): Promise<RestResponse<StarDto>>
  fetchFirstPlanet(): Promise<RestResponse<PlanetDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
  fetchPlanetByStar(starId: Id): Promise<RestResponse<PlanetDto>>
}
