import { AppError } from './AppError'

export class LspError extends AppError {
  readonly line: number

  constructor(message: string, line: number) {
    super(message, 'Code Runner Error')
    this.line = line
  }
}
