import z from 'zod'

export const appModeSchema = z
  .enum(['development', 'production', 'testing', 'staging'])
  .default('development')
