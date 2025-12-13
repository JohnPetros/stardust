import z from 'zod'

export const queryParamBooleanSchema = z
  .enum(['true', 'false'])
  .transform((val) => val === 'true')
