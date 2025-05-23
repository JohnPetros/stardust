import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { emailSchema, idSchema, nameSchema } from '@stardust/validation/global/schemas'

import {
  FetchUserController,
  VerifyUserNameInUseController,
  VerifyUserEmailInUseController,
} from '@/rest/controllers/profile'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import type { HonoSchema } from '../../types'
import { SupabaseUsersRepository } from '@/database'

export class UsersRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/users')

  private fetchUserRoute() {
    this.router.get(
      '/:userId',
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new FetchUserController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private verifyUserNameInUseRoute() {
    this.router.post(
      '/verify-name-in-use',
      zValidator(
        'json',
        z.object({
          name: nameSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new VerifyUserNameInUseController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private verifyUserEmailInUseRoute() {
    this.router.post(
      '/verify-email-in-use',
      zValidator(
        'json',
        z.object({
          email: emailSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new VerifyUserEmailInUseController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchUserRoute()
    this.verifyUserNameInUseRoute()
    this.verifyUserEmailInUseRoute()
    return this.router
  }
}
