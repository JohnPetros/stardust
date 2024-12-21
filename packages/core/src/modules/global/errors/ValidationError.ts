import { AppError } from '.'

type FieldError = {
  name: string
  messages: string[]
}

export class ValidationError extends AppError {
  constructor(readonly fieldErrors: FieldError[]) {
    const message = fieldErrors
      .map((field) => `${field.name}: ${field.messages.join(', ')}`)
      .join('; ')

    super(message, 'Validation Error')
  }
}
