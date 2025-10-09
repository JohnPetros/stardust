import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { app } from '@/app'
import { AuthRouter } from '../AuthRouter'

describe(`Auth Router (${AuthRouter.ROUTE_PREFIX})`, () => {
  const server = app.startServer()
  server.setRoutePrefix(AuthRouter.ROUTE_PREFIX)

  afterAll(() => {
    server.close()
  })

  test(`[POST] ${AuthRouter.ROUTES.signIn}`, async () => {
   
  })
})
