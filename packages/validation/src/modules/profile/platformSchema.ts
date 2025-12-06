import { z } from 'zod'

export const platformSchema = z.enum(['web', 'mobile'])
