import z from 'zod'

export const removeTextBlockAudioSchema = z.object({
  blockIndex: z
    .number()
    .int('Indice do bloco invalido')
    .min(0, 'Indice do bloco invalido'),
})
