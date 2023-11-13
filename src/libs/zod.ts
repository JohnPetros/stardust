import { z } from 'zod'

import { PASSWORD_REGEX } from '@/utils/constants'

const nameSchema = z
  .string()
  .nonempty('Seu nome não pode estar vazio!')
  .min(3, 'Por favor, informe um nome válido!')

const emailSchema = z
  .string()
  .nonempty('Seu e-mail não pode estar vazio!')
  .email('Por favor informe um e-mail válido!')

const passwordSchema = z
  .string()
  .nonempty('Sua senha não pode estar vazia!')
  .regex(
    PASSWORD_REGEX,
    'Senha deve conter pelo menos uma letra minúscula, uma maiúscula, um dígito e um caractere especial.'
  )

export const signInFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignInFormFields = z.infer<typeof signInFormSchema>

export const signUpFormSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    password_confirmation: z.string(),
  })
  .refine((fields) => fields.password === fields.password_confirmation, {
    path: ['password_confirmation'],
    message: 'As senhas precisam de iguais',
  })

export type SignUpFormFields = z.infer<typeof signUpFormSchema>
