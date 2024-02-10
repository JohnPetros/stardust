import { Planet } from '@/@types/Planet'

export interface IPlanetsController {
  getPlanets(): Promise<Planet[]>
}
