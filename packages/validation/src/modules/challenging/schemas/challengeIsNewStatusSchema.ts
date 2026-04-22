import z from 'zod'

export const challengeIsNewStatusSchema = z.enum(['new', 'old', 'all'])
