import { serve as serveInngest } from 'inngest/hono'
import { mock } from 'ts-jest-mocker'
import { DrizzleClient, type DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { HonoApp } from '../HonoApp'

jest.mock('inngest/hono', () => ({
  serve: jest.fn((options: { client?: unknown }) => {
    return (context: { json: (body: unknown) => Response }) =>
      context.json({
        has_client: Boolean(options.client),
      })
  }),
}))

describe('Hono App', () => {
  beforeEach(() => {
    jest.spyOn(DrizzleClient, 'getInstance').mockReturnValue(mock<DrizzleDatabase>())
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should pass the Inngest client to the serve handler', async () => {
    const app = new HonoApp()

    app.registerMiddlewares()
    app.registerInngestRoute()

    const response = await app.hono.request('/inngest', {
      method: 'GET',
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      has_client: true,
    })
    expect(serveInngest).toHaveBeenCalledWith(
      expect.objectContaining({
        client: expect.anything(),
      }),
    )
  })
})
