import z from 'zod'

export const itemsPerPageSchema = z.coerce
  .number({ required_error: 'items por página é obrigatório' })
  .min(1, 'items por página deve ser maior que 0')
