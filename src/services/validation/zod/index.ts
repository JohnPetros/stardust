'use client'

import { zodResolver } from '@hookform/resolvers/zod'

import { emailSchema } from './schemas/emaiSchema'
import { resetPasswordFormSchema } from './schemas/resetPasswordFormSchema'
import { signInFormSchema } from './schemas/signInFormSchema'
import { signUpFormSchema } from './schemas/signUpFormSchema'

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
