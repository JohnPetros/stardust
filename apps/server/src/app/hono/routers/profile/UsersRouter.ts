import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  emailSchema,
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import {
  FetchUserController,
  AcquireAvatarController,
  AcquireRocketController,
  VerifyUserNameInUseController,
  VerifyUserEmailInUseController,
} from '@/rest/controllers/profile'
import { HonoRouter } from '../../HonoRouter'
import { SupabaseUsersRepository } from '@/database'
import { HonoHttp } from '../../HonoHttp'

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
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new FetchUserController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private acquireAvatarRoute() {
    this.router.put(
      '/:userId/avatar',
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          avatarId: idSchema,
          avatarName: nameSchema,
          avatarImage: stringSchema,
          avatarPrice: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new AcquireAvatarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private acquireRocketRoute() {
    this.router.put(
      '/:userId/rocket',
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          rocketId: idSchema,
          rocketName: nameSchema,
          rocketImage: stringSchema,
          rocketPrice: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new AcquireRocketController(repository)
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
        const http = new HonoHttp(context)
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
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new VerifyUserEmailInUseController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchUserRoute()
    this.acquireAvatarRoute()
    this.acquireRocketRoute()
    this.verifyUserNameInUseRoute()
    this.verifyUserEmailInUseRoute()
    return this.router
  }
}
