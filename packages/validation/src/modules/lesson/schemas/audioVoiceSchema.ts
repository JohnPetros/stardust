import z from 'zod'

export const audioVoiceSchema = z.enum(
  ['panda', 'shark', 'princess', 'alien', 'robot', 'salmonense'],
  {
    message: 'Voz inválida',
  },
)
