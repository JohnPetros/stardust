import { AppError } from '../errors/global/AppError'

export class HttpResponse<Response = unknown> {
  readonly body: Response
  readonly statusCode: number

  constructor(body: Response, statusCode = 200) {
    this.body = body
    this.statusCode = statusCode
  }

  throwError() {
    throw new AppError(this.errorMessage)
  }

  get isError() {
    return this.statusCode >= 500
  }

  get errorMessage() {
    return String(this.body)
  }
}
