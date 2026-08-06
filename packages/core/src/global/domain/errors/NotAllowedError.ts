import { AppError } from './AppError'

export class NotAllowedError extends AppError {
  constructor(message: string) {
    super(message, 'Erro de operação não permitida')
  }
}
