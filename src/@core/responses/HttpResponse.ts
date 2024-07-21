import { HTTP_STATUS_CODE } from '../constants'
import { AppError } from '../errors/global/AppError'

export class HttpResponse<Response = any> {
  readonly body: Response
  readonly statusCode: number

  constructor(body: Response, statusCode = HTTP_STATUS_CODE.ok) {
    this.body = body
    this.statusCode = statusCode
  }

  throwError() {
    throw new AppError(this.errorMessage)
  }

  get isError() {
    return this.statusCode >= HTTP_STATUS_CODE.serverError
  }

  get errorMessage() {
    return String(this.body)
  }
}
