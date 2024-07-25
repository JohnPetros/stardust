import { BaseError } from '../global/BaseError'

export class CodeRunnerError extends BaseError {
  readonly line: number

  constructor(message: string, line: number) {
    super()
    this.title = 'Code Runner Error'
    this.message = 'Desafio não encontrado'
    this.line = line
  }
}
