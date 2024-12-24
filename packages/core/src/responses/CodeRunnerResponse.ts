import { AppError, CodeRunnerError } from '#global/errors'

type CodeRunnerResponseProps = {
  result?: string
  outputs?: string[]
  error?: CodeRunnerError | null
}

export class CodeRunnerResponse {
  readonly result: string = ''
  readonly outputs: string[] = []
  private readonly _error: CodeRunnerError | null = null

  constructor({ result, outputs, error }: CodeRunnerResponseProps) {
    if (result) this.result = result
    if (outputs?.length) this.outputs = outputs
    if (error) this._error = error
  }

  get isSuccess(): boolean {
    return this._error === null
  }

  get isFailure(): boolean {
    return this._error instanceof CodeRunnerError
  }

  get errorMessage(): string {
    if (!this._error) throw new AppError('Code Runner Error is not a failure')
    return this._error.message
  }

  get errorLine(): number {
    if (!this._error) throw new AppError('Code Runner Error is not a failure')
    return this._error.line
  }
}
