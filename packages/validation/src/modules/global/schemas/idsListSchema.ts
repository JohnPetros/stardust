import { z } from 'zod'

import { idSchema } from './idSchema'

export const idsListSchema = z.array(idSchema).default([])
