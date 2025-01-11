import z from 'zod'

export const dataTypeNameSchema = z.enum([
  'string',
  'number',
  'boolean',
  'array',
  'undefined',
])
