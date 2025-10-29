import type { RestResponse } from '#global/responses/RestResponse'
import type {
  Id,
  Image,
  Logical,
  Name,
  Slug,
  Text,
} from '#global/domain/structures/index'
import type { PlanetDto, StarDto } from '../domain/entities/dtos'
import type { Planet } from '../domain/entities'

export interface SpaceService {
  fetchStarBySlug(starSlug: Slug): Promise<RestResponse<StarDto>>
  fetchStarById(starId: Id): Promise<RestResponse<StarDto>>
  fetchPlanets(): Promise<RestResponse<PlanetDto[]>>
  createPlanet(
    planetName: Name,
    planetIcon: Image,
    planetImage: Image,
  ): Promise<RestResponse<PlanetDto[]>>
  createPlanetStar(planetId: Id): Promise<RestResponse<StarDto>>
  updatePlanet(planet: Planet): Promise<RestResponse<PlanetDto>>
  reorderPlanets(planetsIds: Id[]): Promise<RestResponse<PlanetDto[]>>
  reorderPlanetStars(planetId: Id, starIds: Id[]): Promise<RestResponse>
  deletePlanet(planetId: Id): Promise<RestResponse>
  deletePlanetStar(planetId: Id, starId: Id): Promise<RestResponse>
  editStarName(starId: Id, name: Text): Promise<RestResponse<StarDto>>
  editStarAvailability(starId: Id, isAvailable: Logical): Promise<RestResponse<StarDto>>
  editStarType(starId: Id, isChallenge: Logical): Promise<RestResponse<StarDto>>
}
