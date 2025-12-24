import { z } from 'zod'

export const storageFolderSchema = z.enum([
  'story',
  'rockets',
  'avatars',
  'planets',
  'achievements',
  'rankings',
  'database-backups',
  'insignias',
])
