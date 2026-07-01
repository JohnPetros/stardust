import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { APP_VERSION } from '@/constants'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'

jest.mock('@/rest/controllers/health', () => ({
  CheckHealthController: jest.fn().mockImplementation(() => ({
    handle: jest.fn((http) =>
      http.send({
        status: 'UP',
        version: APP_VERSION,
        timestamp: new Date().toISOString(),
        services: {
          postgres: 'UP',
          redis: 'UP',
          inngest: 'UP',
          supabase: 'UP',
        },
      }),
    ),
  })),
}))

describe('[GET] /health', () => {
  const honoFixture = new HonoFixture()

  beforeAll(async () => {
    await honoFixture.setup()
  })

  it('should return application health status', async () => {
    const response = await request(honoFixture.server).get('/health')

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      status: 'UP',
      version: APP_VERSION,
      timestamp: expect.any(String),
      services: {
        postgres: 'UP',
        redis: 'UP',
        inngest: 'UP',
        supabase: 'UP',
      },
    })
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp)
  })

  it('should redirect root route to health route', async () => {
    const response = await request(honoFixture.server).get('/')

    expect(response.status).toBe(HTTP_STATUS_CODE.redirect)
    expect(response.headers.location).toBe('/health')
  })
})
