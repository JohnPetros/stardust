import { serve } from 'inngest/next'

import { inngest } from '@/queue/inngest/client'
import { profileFunctions } from '@/queue/inngest/functions/profile'

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [...profileFunctions],
})
