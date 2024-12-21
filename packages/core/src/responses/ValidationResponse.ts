import { ValidationError } from '../errors/lib'

export class ValidationResponse {
  constructor(
    private _isValid: boolean,
    private _errorMessages: string[],
  ) {}

  get isValid() {
    return this._isValid
  }

  get isInvalid() {
    return !this._isValid
  }

  get errorMessages() {
    return this._errorMessages
  }

  throwError() {
    throw new ValidationError(this._errorMessages)
  }
}
