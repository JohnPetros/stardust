import { z } from 'zod'
import { idSchema } from '../../global/schemas'

export const feedbackReadSchema = z.object({
  lastSeenUserMessageId: idSchema,
})
