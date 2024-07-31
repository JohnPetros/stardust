import { HTTP_STATUS_CODE } from '../constants'
import { AppError } from '../errors/global/AppError'

export class HttpResponse<Response = any> {
  private readonly _body: Response
  private readonly _statusCode: number

  constructor(body: Response, statusCode = HTTP_STATUS_CODE.ok) {
    this._body = body
    this._statusCode = statusCode
  }

  throwError() {
    throw new AppError(this.errorMessage)
  }

  get isError() {
    return this.statusCode >= HTTP_STATUS_CODE.serverError
  }

  get body() {
    if (this.isError) this.throwError()

    return this._body
  }

  get statusCode() {
    return this._statusCode
  }

  get errorMessage() {
    return String(this.body)
  }
}
