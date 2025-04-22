import { NotFoundError } from '../../../global/domain/errors'

export class SelectedRocketByDefaultNotFoundError extends NotFoundError {
  constructor() {
    super('Foguete selecionado por padrão não encontrado.')
  }
}
