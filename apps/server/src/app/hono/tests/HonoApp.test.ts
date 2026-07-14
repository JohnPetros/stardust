import { serve as serveInngest } from 'inngest/hono'

import { ENV } from '@/constants'
import { HonoApp } from '../HonoApp'

jest.mock('inngest/hono', () => ({
  serve: jest.fn((options: { signingKey?: string }) => {
    return (context: { json: (body: unknown) => Response }) =>
      context.json({
        has_signing_key: Boolean(options.signingKey),
      })
  }),
}))

describe('Hono App', () => {
  it('should pass production Inngest signing key to serve handler', async () => {
    const app = new HonoApp()
    const previousMode = ENV.mode
    const previousInngestSigningKey = ENV.inngestSigningKey

    ENV.mode = 'production'
    ENV.inngestSigningKey = 'signkey-prod-test'

    try {
      app.registerMiddlewares()
      app.registerInngestRoute()

      const response = await app.hono.request('/inngest', {
        method: 'GET',
      })

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toEqual({
        has_signing_key: true,
      })
      expect(serveInngest).toHaveBeenCalledWith(
        expect.objectContaining({
          signingKey: 'signkey-prod-test',
        }),
      )
    } finally {
      ENV.mode = previousMode
      ENV.inngestSigningKey = previousInngestSigningKey
    }
  })
})
