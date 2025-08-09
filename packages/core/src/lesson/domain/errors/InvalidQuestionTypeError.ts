import { ValidationError } from '../../../global/domain/errors'

export class InvalidQuestionTypeError extends ValidationError {
  constructor() {
    super([
      {
        name: 'question-type',
        messages: ['Tipo de questão inválido'],
      },
    ])
  }
}
