import { AppError } from './AppError'

export class ExceededRequestsError extends AppError {
  constructor(message: string) {
    super(message, 'Exceeded Requests Error')
  }
}
