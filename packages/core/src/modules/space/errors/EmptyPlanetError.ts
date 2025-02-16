import { AppError } from '#global/errors'

export class EmptyPlanetError extends AppError {
  constructor(planetName: string) {
    super(`Planeta ${planetName} não possui nenhuma estrela.`)
  }
}
