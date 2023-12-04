import { Planet } from '@/@types/planet'

export interface IPlanetService {
  getPlanets(): Promise<Planet[]>
}
