import { z } from 'zod'

export const accountProviderSchema = z.enum(['google', 'github', 'email'])
