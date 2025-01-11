import z from 'zod'

export const integerSchema = z.number().min(0)
