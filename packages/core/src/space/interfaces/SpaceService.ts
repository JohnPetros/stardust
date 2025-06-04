import type { RestResponse } from '#global/responses/RestResponse'
import type { Id, Slug } from '#global/domain/structures/index'
import type { PlanetDto, StarDto } from '../domain/entities/dtos'

export interface SpaceService {
  fetchStarBySlug(starSlug: Slug): Promise<RestResponse<StarDto>>
  fetchStarById(starId: Id): Promise<RestResponse<StarDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
}
