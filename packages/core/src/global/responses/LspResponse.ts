import { AppError, LspError } from '../domain/errors'

type LspResponseProps = {
  result?: string
  outputs?: string[]
  error?: LspError | null
  errors?: LspError[]
}

export class LspResponse {
  readonly result: string = ''
  readonly outputs: string[] = []
  private readonly _error: LspError | null = null
  private readonly _errors: LspError[] = []

  constructor({ result, outputs, error, errors = [] }: LspResponseProps) {
    if (typeof result !== 'undefined') this.result = result
    if (outputs?.length) this.outputs = outputs
    if (error) this._error = error
    this._errors = errors
  }

  throwError() {
    throw new LspError(this.errorMessage, this.errorLine)
  }

  get isSuccessful(): boolean {
    return this._error === null
  }

  get isFailure(): boolean {
    return this._error instanceof LspError || this._errors.length > 0
  }

  get errorMessage(): string {
    if (!this._error) throw new AppError('Não há erro no exceutor de código')
    return this._error.message
  }

  get errors(): LspError[] {
    return this._errors
  }

  get errorLine(): number {
    if (!this._error) throw new AppError('Não há erro no exceutor de código')
    return this._error.line
  }
}
