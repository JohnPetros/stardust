'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { SafeParseReturnType } from 'zod'

import { commentSchema } from './schemas/commentSchema'
import { emailSchema } from './schemas/emaiSchema'
import { resetPasswordFormSchema } from './schemas/resetPasswordFormSchema'
import { signInFormSchema } from './schemas/signInFormSchema'
import { signUpFormSchema } from './schemas/signUpFormSchema'

import { IValidationProvider } from '@/providers/interfaces/IValidationProvider'

function returnValidation(validation: SafeParseReturnType<string, string>) {
  return {
    isValid: validation.success,
    errors: !validation.success ? validation?.error.format()._errors : [],
  }
}

export const zodProvider: IValidationProvider = {
  validateEmail(email: string) {
    const emailValidation = emailSchema.safeParse(email)
    return returnValidation(emailValidation)
  },

  validateComment(comment: string) {
    const commentValidation = commentSchema.safeParse(comment)
    return returnValidation(commentValidation)
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
