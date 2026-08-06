import { AppError } from '../../../global/domain/errors'

export class CodeExplanationLimitExceededError extends AppError {
  constructor() {
    super(
      'O limite diário de explicações de código foi excedido',
      'Limite de explicações de código excedido',
    )
  }
}
