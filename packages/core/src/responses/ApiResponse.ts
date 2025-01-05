import { HTTP_STATUS_CODE } from '../constants/http-status-code'
import {
  AppError,
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '#global/errors'

type ApiResponseProps<Body> = {
  body?: Body
  statusCode?: number
  errorMessage?: string
  headers?: Record<string, string>
}

export class ApiResponse<Body = unknown> {
  private readonly _body: Body | null
  private readonly _errorMessage: string | null
  readonly statusCode: number = HTTP_STATUS_CODE.ok
  readonly headers: Record<string, string> = {}

  constructor({ body, statusCode, errorMessage, headers }: ApiResponseProps<Body> = {}) {
    this._body = body ?? null
    this._errorMessage = errorMessage ?? null
    if (statusCode) this.statusCode = statusCode
    if (headers) this.headers = headers
  }

  throwError() {
    if (this.statusCode === HTTP_STATUS_CODE.notFound)
      throw new NotFoundError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.conflict)
      throw new ConflictError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.badRequest)
      throw new ValidationError([{ name: 'erro', messages: [this.errorMessage] }])

    if (this.statusCode === HTTP_STATUS_CODE.tooManyRequests)
      throw new ConflictError(this.errorMessage)

    if (
      this.statusCode === HTTP_STATUS_CODE.unauthorized ||
      this.statusCode === HTTP_STATUS_CODE.forbidden
    )
      throw new AuthError(this.errorMessage)

    if (
      this.statusCode === HTTP_STATUS_CODE.notAcceptable ||
      this.statusCode >= HTTP_STATUS_CODE.serverError
    )
      throw new AppError(this.errorMessage)

    throw new AppError(this.errorMessage)
  }

  get isSuccess() {
    return this.statusCode <= HTTP_STATUS_CODE.redirect
  }

  get isFailure() {
    return this.statusCode >= HTTP_STATUS_CODE.badRequest || this._errorMessage
  }

  get body(): Body {
    if (this._body === null) {
      throw new AppError('Response has no body')
    }

    return this._body
  }

  getHeader(key: string) {
    return this.headers[key] ?? null
  }

  get errorMessage(): string {
    if (!this._errorMessage) {
      throw new AppError('Response has no error message')
    }

    return this._errorMessage
  }
}
