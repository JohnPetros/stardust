import { z } from 'zod'
import {
  dateSchema,
  idSchema,
  itemsPerPageSchema,
  pageSchema,
  searchSchema,
} from '../../global/schemas'
import { feedbackReportIntentSchema } from './feedbackReportIntentSchema'

export const feedbackReportsQuerySchema = z
  .object({
    search: searchSchema.optional(),
    intent: feedbackReportIntentSchema.optional(),
    status: z.enum(['open', 'closed']).optional(),
    createdAtStartDate: dateSchema.optional(),
    createdAtEndDate: dateSchema.optional(),
    page: pageSchema.optional(),
    itemsPerPage: itemsPerPageSchema.optional(),
  })
  .refine(
    ({ createdAtStartDate, createdAtEndDate }) =>
      !createdAtStartDate || !createdAtEndDate || createdAtStartDate <= createdAtEndDate,
    {
      path: ['createdAtEndDate'],
      message: 'data final deve ser maior ou igual à data inicial',
    },
  )
  .refine(
    ({ search }) =>
      !search || !idSchema.safeParse(search).success || search.length <= 100,
    {
      path: ['search'],
      message: 'busca deve ser um UUID ou conter no máximo 100 caracteres',
    },
  )

export const userFeedbackReportsQuerySchema = z
  .object({
    status: z.enum(['open', 'closed']).optional(),
    page: pageSchema.optional(),
    itemsPerPage: itemsPerPageSchema.optional(),
  })
  .strict()
