import z from 'zod'

export const audioVoiceSchema = z.enum(['panda', 'shark', 'princess'], {
  message: 'voz invalida',
})
