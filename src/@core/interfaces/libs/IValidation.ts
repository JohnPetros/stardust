import { Email } from '@/@core/domain/structs/Email'
import { ValidationResponse } from '@/@core/responses'

export interface IValidation {
  validateEmail(email: Email): ValidationResponse
}
