import { AppError } from './AppError'

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'Not Found Error')
  }
}
