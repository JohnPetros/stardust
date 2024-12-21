import type { BaseError } from '@/@core/errors/global/BaseError'
import { AppError } from '../errors/global/AppError'

export class ServiceResponse<Data> {
  constructor(
    private _data: Data | null,
    private _error: typeof BaseError | null = null,
  ) {}

  get isSuccess() {
    return this._data !== null && this.error === null
  }

  get isFailure() {
    return this._data === null && this.error !== null
  }

  get data() {
    return this._data as Data
  }

  get errorMessage() {
    if (!this.error) throw new AppError('Error not found')

    const error = new this.error()
    return error.message
  }

  get error() {
    return this._error
  }

  throwError() {
    if (this.error) throw new this.error()
  }
}
