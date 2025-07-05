import { HTTP_STATUS_CODE } from '../constants/http-status-code'
import {
  AppError,
  AuthError,
  ConflictError,
  NotAllowedError,
  NotFoundError,
  ValidationError,
} from '../domain/errors'
import { HTTP_HEADERS } from '../constants'

type RestResponseProps<Body> = {
  body?: Body
  statusCode?: number
  errorMessage?: string
  headers?: Record<string, string>
}

export class RestResponse<Body = unknown> {
  private readonly _body: Body | null
  private readonly _errorMessage: string | null
  readonly statusCode: number = HTTP_STATUS_CODE.ok
  readonly headers: Record<string, string> = {}

  constructor({ body, statusCode, errorMessage, headers }: RestResponseProps<Body> = {}) {
    this._body = body ?? null
    this._errorMessage = errorMessage ?? null
    if (statusCode) this.statusCode = statusCode
    if (headers) this.headers = headers
  }

  throwError(): never {
    if (this.statusCode === HTTP_STATUS_CODE.notFound)
      throw new NotFoundError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.conflict)
      throw new ConflictError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.badRequest)
      throw new ValidationError([{ name: 'erro', messages: [this.errorMessage] }])

    if (this.statusCode === HTTP_STATUS_CODE.tooManyRequests)
      throw new ConflictError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.unauthorized)
      throw new AuthError(this.errorMessage)

    if (this.statusCode === HTTP_STATUS_CODE.forbidden)
      throw new NotAllowedError(this.errorMessage)

    if (
      this.statusCode === HTTP_STATUS_CODE.notAcceptable ||
      this.statusCode >= HTTP_STATUS_CODE.serverError
    )
      throw new AppError(this.errorMessage)

    throw new AppError(this.errorMessage)
  }

  get isSuccessful() {
    return this.statusCode <= HTTP_STATUS_CODE.redirect
  }

  get isFailure() {
    return this.statusCode >= HTTP_STATUS_CODE.badRequest || Boolean(this._errorMessage)
  }

  get isValidationFailure() {
    return this.statusCode === HTTP_STATUS_CODE.badRequest
  }

  getValidationFieldErrors(fieldName: string) {
    if (!this.isValidationFailure)
      throw new AppError('Rest Response is not a validation failure')

    const validationError = this.body as ValidationError
    const fieldError = validationError.fieldErrors.find(
      (error) => error.name === fieldName,
    )

    if (!fieldError) throw new AppError(`Field error not found for field ${fieldName}`)

    return fieldError.messages
  }

  getHeader(key: string) {
    return this.headers[key] ?? null
  }

  get body(): Body {
    if (this._errorMessage) {
      throw new AppError('Rest Response failed')
    }

    return this._body as Body
  }

  get errorMessage(): string {
    if (!this._errorMessage) {
      throw new AppError('Rest Response has no error message')
    }

    return this._errorMessage
  }

  get isRedirecting() {
    return (
      this.statusCode === HTTP_STATUS_CODE.redirect &&
      this.getHeader(HTTP_HEADERS.location)
    )
  }
}
