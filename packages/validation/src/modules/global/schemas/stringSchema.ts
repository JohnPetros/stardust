import { z } from 'zod'

export const stringSchema = z.string({ required_error: 'Campo obrigatório' })
