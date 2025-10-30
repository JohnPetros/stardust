import z from 'zod'

export const appModeSchema = z.enum(['dev', 'prod', 'test', 'staging']).default('dev')
