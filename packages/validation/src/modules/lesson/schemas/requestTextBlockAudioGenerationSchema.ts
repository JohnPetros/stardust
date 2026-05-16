import z from 'zod'

import { audioVoiceSchema } from './audioVoiceSchema'

export const requestTextBlockAudioGenerationSchema = z.object({
  blockIndex: z
    .number()
    .int('Indice do bloco invalido')
    .min(0, 'Indice do bloco invalido'),
  voice: audioVoiceSchema,
})
