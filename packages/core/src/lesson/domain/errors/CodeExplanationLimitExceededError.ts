import { AppError } from '../../../global/domain/errors'

export class CodeExplanationLimitExceededError extends AppError {
  constructor() {
    super('Code explanation daily limit exceeded', 'Code Explanation Limit Exceeded')
  }
}
