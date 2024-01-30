import type { Resolver } from 'react-hook-form'

import type { ResetPasswordForm } from '@/services/validation/types/ResetPasswordForm'
import type { SignInForm } from '@/services/validation/types/signInForm'
import type { SignUpForm } from '@/services/validation/types/signUpForm'

type ValidationResult = {
  isValid: boolean
  errors: string[]
}
export interface IValidationProvider {
  validateEmail(email: string): ValidationResult
  validateComment(comment: string): ValidationResult
  resolveSignInForm(): Resolver<SignInForm>
  resolveSignUpForm(): Resolver<SignUpForm>
  resolveResetPasswordForm(): Resolver<ResetPasswordForm>
}
