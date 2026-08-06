import { AppError } from './AppError'

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'Erro de recurso não encontrado')
  }
}
