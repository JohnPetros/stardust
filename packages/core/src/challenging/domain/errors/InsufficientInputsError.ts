import { AppError } from '../../../global/domain/errors'

export class InsufficientInputsError extends AppError {
  constructor() {
    super(
      'número de entrada issuficiente para executar o código.',
      'Insufficient Inputs Error',
    )
  }
}
