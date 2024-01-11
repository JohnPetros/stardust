import type { Resolver } from 'react-hook-form'

import type { ResetPasswordForm } from '@/services/validation/types/passwordResetForm'
import type { SignInForm } from '@/services/validation/types/signInForm'
import type { SignUpForm } from '@/services/validation/types/signUpForm'

export interface IValidationProvider {
  validateEmail(email: string): Promise<boolean>
  resolveSignInForm(): Resolver<SignInForm>
  resolveSignUpForm(): Resolver<SignUpForm>
  resolveResetPasswordForm(): Resolver<ResetPasswordForm>
}
