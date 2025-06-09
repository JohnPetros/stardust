import { z } from 'zod'

import { stringSchema } from '../global/schemas'

export const textsListSchema = z.array(stringSchema)
