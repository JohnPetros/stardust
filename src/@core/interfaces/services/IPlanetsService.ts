import type { ServiceResponse } from '@/@core/responses'
import type { PlanetDTO } from '@/@core/dtos'
import type { Planet } from '@/@core/domain/entities'

export interface IPlanetsService {
  fetchPlanets(): Promise<ServiceResponse<PlanetDTO[]>>
  fetchPlanetByStar(starId: string): Promise<ServiceResponse<PlanetDTO>>
  savePlanet(planet: Planet): Promise<ServiceResponse<true>>
}
