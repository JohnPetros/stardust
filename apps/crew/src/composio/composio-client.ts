import { Composio } from '@composio/core'
import { MastraProvider } from '@composio/mastra'

import { env } from '@/env'

export const composioClient = new Composio({
  apiKey: env.COMPOSIO_API_KEY,
  provider: new MastraProvider(),
})
