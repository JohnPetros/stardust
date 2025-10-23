import type { RestResponse } from '#global/responses/RestResponse'
import type { Id, Logical, Slug, Text } from '#global/domain/structures/index'
import type { PlanetDto, StarDto } from '../domain/entities/dtos'
import type { Star } from '../domain/entities'

export interface SpaceService {
  fetchStarBySlug(starSlug: Slug): Promise<RestResponse<StarDto>>
  fetchStarById(starId: Id): Promise<RestResponse<StarDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
  createPlanetStar(planetId: Id, star: Star): Promise<RestResponse<StarDto>>
  reorderPlanetStars(planetId: Id, starIds: Id[]): Promise<RestResponse>
  deletePlanetStar(planetId: Id, starId: Id): Promise<RestResponse>
  editStarName(starId: Id, name: Text): Promise<RestResponse<StarDto>>
  editStarAvailability(starId: Id, isAvailable: Logical): Promise<RestResponse<StarDto>>
  editStarType(starId: Id, isChallenge: Logical): Promise<RestResponse<StarDto>>
}
