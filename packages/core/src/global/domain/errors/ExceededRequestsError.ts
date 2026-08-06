import { AppError } from './AppError'

export class ExceededRequestsError extends AppError {
  constructor(message: string) {
    super(message, 'Limite de requisições excedido')
  }
}
