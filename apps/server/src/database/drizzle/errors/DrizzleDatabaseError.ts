import { AppError } from '@stardust/core/global/errors'

export class DrizzleDatabaseError extends AppError {
  constructor() {
    super('Ocorreu um erro ao acessar o banco de dados')
  }
}
