import { NotFoundError } from '../../global/errors'

export class SelectedRocketByDefaultNotFoundError extends NotFoundError {
  constructor() {
    super('Foguete selecionado por padrão não encontrado.')
  }
}
