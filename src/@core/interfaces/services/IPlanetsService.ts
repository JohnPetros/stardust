import type { ServiceResponse } from '@/@core/responses'
import type { PlanetDTO } from '@/@core/dtos'

export interface IPlanetsService {
  fetchPlanets(): Promise<ServiceResponse<PlanetDTO[]>>
}
