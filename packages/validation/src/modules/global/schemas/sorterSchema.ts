import { z } from 'zod'

export const sorterSchema = z.enum(['ascending', 'descending', 'none']).default('none')
