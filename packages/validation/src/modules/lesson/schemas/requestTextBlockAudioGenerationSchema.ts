import z from 'zod'

import { audioVoiceSchema } from './audioVoiceSchema'

export const requestTextBlockAudioGenerationSchema = z.object({
  blockIndex: z
    .number()
    .int('Índice do bloco inválido')
    .min(0, 'Índice do bloco inválido'),
  voice: audioVoiceSchema,
})
