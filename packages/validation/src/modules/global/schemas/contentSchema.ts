import z from 'zod'

export const contentSchema = z
  .string({ required_error: 'conteúdo é obrigatório' })
  .min(3, 'conteúdo deve conter pelo menos 3 caracteres')
  .max(5000, 'conteúdo deve conter no máximo 5000 caracteres')
