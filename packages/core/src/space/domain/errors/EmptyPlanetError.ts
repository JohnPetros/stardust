import { AppError } from '../../../global/domain/errors'

export class EmptyPlanetError extends AppError {
  constructor(planetName: string) {
    super(`Planeta ${planetName} não possui nenhuma estrela.`)
  }
}
