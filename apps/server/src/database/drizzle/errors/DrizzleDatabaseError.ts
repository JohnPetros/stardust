import { AppError } from '@stardust/core/global/errors'

export class DrizzleDatabaseError extends AppError {
  constructor(cause?: unknown) {
    super('Ocorreu um erro ao acessar o banco de dados')
    Object.defineProperty(this, 'cause', { value: cause, enumerable: false })
  }
}
