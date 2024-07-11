import type { ServiceResponse } from '@/@core/responses'
import type { Planet } from '@/@core/domain/entities'

export interface IPlanetsService {
  fetchPlanets(): Promise<ServiceResponse<Planet[]>>
}
