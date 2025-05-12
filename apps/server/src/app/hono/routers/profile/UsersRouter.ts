import { type Context, Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { FetchUserController } from '@/rest/controllers/profile'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import type { HonoSchema } from '../../types'

export class UsersRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/users')

  private fetchUserRoute() {
    this.router.get(
      '/:userId',
      zValidator(
        'param',
        z.object({
          userId: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const controller = new FetchUserController()
        const response = await controller.handle(http)
        return this.app.sendRestResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchUserRoute()
    return this.router
  }
}
