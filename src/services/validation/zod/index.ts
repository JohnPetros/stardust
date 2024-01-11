import { zodResolver } from '@hookform/resolvers/zod'

import { emailSchema } from './schemas/emaiSchema'

import {
  resetPasswordFormSchema,
  signInFormSchema,
  signUpFormSchema,
} from '@/libs/zod'
import { IValidationProvider } from '@/providers/interfaces/IValidationProvider'

export const zodProvider: IValidationProvider = {
  async validateEmail(email: string) {
    return (await emailSchema.safeParseAsync(email)).success
  },

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
