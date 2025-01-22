import { serve } from 'inngest/next'

import { inngest } from '@/queue/inngest/client'
import { profileFunctions } from '@/queue/inngest/functions/profile'
import { rankingFunctions } from '@/queue/inngest/functions/ranking'
import { shopFunctions } from '@/queue/inngest/functions/shop'
import { spaceFunctions } from '@/queue/inngest/functions/space'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    ...profileFunctions,
    ...spaceFunctions,
    ...rankingFunctions,
    ...shopFunctions,
  ],
})
