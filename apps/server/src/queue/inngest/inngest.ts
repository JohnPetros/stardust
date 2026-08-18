import { Inngest } from 'inngest'

import { ENV } from '../../constants'

export const inngest = new Inngest({
  id: 'StarDust Queue',
  baseUrl: ENV.mode === 'test' ? process.env.INNGEST_DEV : undefined,
  eventKey: ENV.mode === 'production' ? ENV.inngestEventKey : undefined,
  signingKey: ENV.mode === 'production' ? ENV.inngestSigningKey : undefined,
  isDev: ENV.mode !== 'production',
})
