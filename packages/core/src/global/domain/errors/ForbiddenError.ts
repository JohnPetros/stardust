import { AppError } from './AppError'

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 'Erro de operação proibida')
  }
}
