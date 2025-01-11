import z from 'zod'

export const titleSchema = z
  .string({ required_error: 'título é obrigatório' })
  .min(3, 'título deve conter pelo menos 3 caracteres')
