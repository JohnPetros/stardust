import { PostgresStore } from '@mastra/pg'

import { env } from '@/env'

export const mastraStore = new PostgresStore({
  id: 'crew-mastra',
  connectionString: env.CREW_DATABASE_URL,
  schemaName: 'mastra',
})
