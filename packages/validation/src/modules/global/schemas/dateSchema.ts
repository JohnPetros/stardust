import { z } from 'zod'

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'O formato deve ser YYYY-MM-DD',
  })
  .optional()
