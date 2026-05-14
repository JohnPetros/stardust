import { z } from 'zod'

export const fileStorageFolderPathSchema = z.enum([
  'images/story',
  'images/rockets',
  'images/avatars',
  'images/planets',
  'images/achievements',
  'images/rankings',
  'images/insignias',
  'images/feedback-reports',
  'database-backups',
])
