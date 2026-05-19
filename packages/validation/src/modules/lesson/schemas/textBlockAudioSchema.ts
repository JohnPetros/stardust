import z from 'zod'

import { audioVoiceSchema } from './audioVoiceSchema'

export const textBlockAudioSchema = z.object({
  fileName: z.string(),
  voice: audioVoiceSchema,
  status: z.enum(['idle', 'pending', 'error', 'done', 'cancelled']),
})
