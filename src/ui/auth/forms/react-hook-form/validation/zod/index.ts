import { zodResolver } from '@hookform/resolvers/zod'

import { signInFormSchema } from './schemas'
import { signUpFormSchema } from './schemas/sign-up-form-schema'
import { resetPasswordFormSchema } from './schemas/reset-password-schema'

export const ZodValidationResolver = () => {
  return {
    resolveSignInForm() {
      return zodResolver(signInFormSchema)
    },

    resolveSignUpForm() {
      return zodResolver(signUpFormSchema)
    },

    resolveResetPasswordForm() {
      return zodResolver(resetPasswordFormSchema)
    },
  }
}
