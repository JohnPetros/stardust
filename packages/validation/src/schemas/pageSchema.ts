import z from 'zod'

export const pageSchema = z.coerce.number().optional().default(1)
