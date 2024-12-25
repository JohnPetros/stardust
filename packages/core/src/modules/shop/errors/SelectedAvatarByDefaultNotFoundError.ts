import { NotFoundError } from '../../global/errors'

export class SelectedAvatarByDefaultNotFoundError extends NotFoundError {
  constructor() {
    super('Avatar selecionado por padrão não encontrado.')
  }
}
