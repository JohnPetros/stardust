import { UnexpectedError } from '../global'

export class FetchPlanetsUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar planetas.')
  }
}
