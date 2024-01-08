import { Planet } from '@/@types/planet'

export interface IPlanetsController {
  getPlanets(): Promise<Planet[]>
}
