import { z } from 'zod'

export const accountProviderSchema = z.enum(['email', 'google', 'github'])
