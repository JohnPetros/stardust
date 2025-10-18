import { z } from 'zod'

export const ordinalNumberSchema = z.number().int().positive().min(1)
