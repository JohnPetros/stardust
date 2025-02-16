import { HTTP_STATUS_CODE } from '#constants'
import { AppError } from './AppError'

export class ApiError extends AppError {
  readonly statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message, 'Api error')
    this.statusCode = statusCode ?? HTTP_STATUS_CODE.serverError
  }
}
