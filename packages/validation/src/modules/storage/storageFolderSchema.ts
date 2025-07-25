import { z } from 'zod'

export const storageFolderSchema = z.enum([
  'story',
  'rockets',
  'avatars',
  'database-backups',
])
