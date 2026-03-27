import { z } from 'zod'

import {
  idsListSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '../../global/schemas'
import { challengeCompletionStatusSchema } from './challengeCompletionStatusSchema'
import { challengeDifficultyLevelsSchema } from './challengeDifficultyLevelsSchema'

export const challengesNavigationSidebarQuerySchema = z.object({
  page: pageSchema.default(1),
  itemsPerPage: itemsPerPageSchema.default(20),
  title: stringSchema.default(''),
  difficultyLevels: challengeDifficultyLevelsSchema,
  categoriesIds: idsListSchema,
  completionStatus: challengeCompletionStatusSchema.default('all'),
})
