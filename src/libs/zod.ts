import { z } from 'zod'

import { REGEX, VALIDATION_ERRORS } from '@/utils/constants'

const nameSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .min(3, VALIDATION_ERRORS.name.min)

export const emailSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .email(VALIDATION_ERRORS.email.regex)

export const passwordSchema = z
  .string()
  .nonempty(VALIDATION_ERRORS.nonempty)
  .regex(REGEX.password, VALIDATION_ERRORS.password.regex)

export const passwordConfirmationSchema = z.string()

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signUpFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERRORS.password_confirmation.equal,
  })

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    password_confirmation: passwordConfirmationSchema,
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: VALIDATION_ERRORS.password_confirmation.equal,
  })

export type SignInFormFields = z.infer<typeof signInFormSchema>
export type SignUpFormFields = z.infer<typeof signUpFormSchema>
export type ResetPasswordFormFields = z.infer<typeof resetPasswordFormSchema>
