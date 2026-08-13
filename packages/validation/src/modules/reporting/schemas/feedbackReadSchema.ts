import { z } from 'zod'
import { idSchema } from '../../global/schemas'

export const feedbackReadSchema = z
  .object({
    lastSeenMessageId: idSchema.optional(),
    // Kept during the migration so the existing Studio administrative route
    // remains readable until its adapter adopts the participant-aware name.
    lastSeenUserMessageId: idSchema.optional(),
  })
  .refine(({ lastSeenMessageId, lastSeenUserMessageId }) =>
    Boolean(lastSeenMessageId ?? lastSeenUserMessageId),
  )
  .transform((value) => ({
    ...value,
    lastSeenMessageId: value.lastSeenMessageId ?? value.lastSeenUserMessageId,
  }))
