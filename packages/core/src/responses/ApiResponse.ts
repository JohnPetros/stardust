import { HTTP_STATUS_CODE } from '../constants/http-status-code'
import { AppError } from '../modules/global/errors'

type ApiResponseProps<Body> = {
  body?: Body
  statusCode?: number
  error?: typeof AppError
}

export class ApiResponse<Body> {
  private readonly _body: Body | null
  private readonly _statusCode: number
  private readonly _error: typeof AppError | null

  constructor({ body, statusCode, error }: ApiResponseProps<Body>) {
    this._body = body ?? null
    this._statusCode = statusCode ?? HTTP_STATUS_CODE.ok
    this._error = error ?? null
  }

  throwError() {
    if (this.error) throw new this.error()
  }

  get isSuccess() {
    return this.statusCode <= HTTP_STATUS_CODE.badRequest
  }

  get isFailure() {
    return this.statusCode >= HTTP_STATUS_CODE.badRequest || this._error
  }

  get body(): Body {
    if (this._body === null) {
      throw new AppError('Response is an error')
    }

    return this._body
  }

  get statusCode(): number {
    return this._statusCode
  }

  get error() {
    return this._error
  }

  get errorMessage(): string {
    if (!this._error) {
      throw new AppError('Response is not an error')
    }

    const error = new this._error()
    return error.message
  }
}
