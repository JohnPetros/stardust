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
}

export class ApiResponse<Body> {
  private readonly _body: Body | null
  private readonly _statusCode: number
  private readonly _errorMessage: string | null

  constructor({ body, statusCode, errorMessage }: ApiResponseProps<Body> = {}) {
    this._body = body ?? null
    this._statusCode = statusCode ?? HTTP_STATUS_CODE.ok
    this._errorMessage = errorMessage ?? null
  }

  throwError() {
    if (this.statusCode === HTTP_STATUS_CODE.notFound)
      throw new NotFoundError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.conflict)
      throw new ConflictError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.tooManyRequests)
      throw new ConflictError(this.errorMessage)

    if (
      this.statusCode === HTTP_STATUS_CODE.unauthorized ||
      this.statusCode === HTTP_STATUS_CODE.forbidden
    )
      throw new AuthError(this.errorMessage)

    if (this.statusCode >= HTTP_STATUS_CODE.serverError)
      throw new AppError(this.errorMessage)
  }

  get isSuccess() {
    return this.statusCode <= HTTP_STATUS_CODE.badRequest
  }

  get isFailure() {
    return this.statusCode >= HTTP_STATUS_CODE.badRequest || this._errorMessage
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

  get errorMessage(): string {
    if (!this._errorMessage) {
      throw new AppError('Response has no error message')
    }

    return this._errorMessage
  }
}
