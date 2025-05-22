import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  emailSchema,
  idSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import {
  SignInController,
  SignOutController,
  SignUpController,
} from '@/rest/controllers/auth'
import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import type { HonoSchema } from '../../types'

export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/auth')

  private signInRoute(): void {
    this.router.post(
      '/sign-in',
      zValidator(
        'json',
        z.object({
          email: emailSchema,
          password: passwordSchema,
          name: nameSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const service = new SupabaseAuthService(http.getSupabase())
        const controller = new SignInController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private signUpRoute(): void {
    this.router.post(
      '/sign-up',
      zValidator(
        'json',
        z.object({
          email: emailSchema,
          password: passwordSchema,
          name: nameSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const service = new SupabaseAuthService(http.getSupabase())
        const eventBroker = new InngestEventBroker(http.getInngest())
        const controller = new SignUpController(service, eventBroker)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private signOutRoute(): void {
    this.router.put(
      '/:userId/:achievementId',
      zValidator(
        'param',
        z.object({
          userId: idSchema,
          achievementId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new SignOutController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.signInRoute()
    this.signUpRoute()
    this.signOutRoute()
    return this.router
  }
}
