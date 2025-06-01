import { AppError } from '../domain/errors'

type Props<Data> = {
  data?: Data | null
  errorMessage?: string | null
}

export class ActionResponse<Data = void> {
  private readonly _data: Data | null
  private readonly _errorMessage: string | null

  constructor({ data = null, errorMessage = null }: Props<Data> = {}) {
    this._data = data
    this._errorMessage = errorMessage
  }

  get isSuccessful() {
    return this._errorMessage === null
  }

  get isFailure() {
    return this._errorMessage !== null
  }

  get data(): Data {
    if (this._errorMessage) {
      throw new AppError('Action Response failed')
    }

    return this._data as Data
  }

  get errorMessage() {
    if (!this._errorMessage) {
      throw new AppError('Action Response has no error message')
    }

    return this._errorMessage
  }
}
