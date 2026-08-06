import { AppError } from './AppError'

export class LspError extends AppError {
  readonly line: number

  constructor(message: string, line: number) {
    super(message, 'Erro na execução do código')
    this.line = line
  }
}
