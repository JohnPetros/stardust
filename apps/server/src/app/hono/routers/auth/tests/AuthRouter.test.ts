import { app } from '@/app'
import { AuthRouter } from '../AuthRouter'

describe('Auth Router (/auth)', () => {
  const server = app.startServer(0)
  server.setRoutePrefix('/auth')

  afterAll(() => {
    server.close()
  })

  test('[POST] /sign-in', async () => {})
})
