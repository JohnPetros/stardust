import { serve } from 'inngest/next'

import { inngest } from '@/queue/inngest/client'
import {
  profileFunctions,
  rankingFunctions,
  shopFunctions,
  spaceFunctions,
} from '@/queue/inngest/functions'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    ...profileFunctions,
    ...rankingFunctions,
    ...shopFunctions,
    ...spaceFunctions,
  ],
})
