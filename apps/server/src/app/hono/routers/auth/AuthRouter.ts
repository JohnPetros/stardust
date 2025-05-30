import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
} from '@stardust/validation/global/schemas'

import {
  ConfirmPasswordResetController,
  RequestPasswordResetController,
  ResetPasswordController,
  SignInController,
  SignOutController,
  SignUpController,
  ConfirmEmailController,
} from '@/rest/controllers/auth'
import { SupabaseAuthService } from '@/rest/services/SupabaseAuthService'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'

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
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
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
        const http = new HonoHttp(context)
        const service = new SupabaseAuthService(http.getSupabase())
        const eventBroker = new InngestEventBroker()
        const controller = new SignUpController(service, eventBroker)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private signOutRoute(): void {
    this.router.delete('/sign-out', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new SignOutController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private confirmEmailRoute(): void {
    this.router.get(
      '/confirm-email',
      zValidator(
        'query',
        z.object({
          token: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ConfirmEmailController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private requestPasswordResetRoute(): void {
    this.router.post(
      '/request-password-reset',
      zValidator(
        'json',
        z.object({
          email: emailSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new RequestPasswordResetController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private confirmPasswordResetRoute(): void {
    this.router.get(
      '/confirm-password-reset',
      zValidator(
        'query',
        z.object({
          token: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ConfirmPasswordResetController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private resetPasswordRoute(): void {
    this.router.patch(
      '/reset-password',
      zValidator(
        'json',
        z.object({
          newPassword: passwordSchema,
          accessToken: z.string(),
          refreshToken: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ResetPasswordController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.signInRoute()
    this.signUpRoute()
    this.signOutRoute()
    this.confirmEmailRoute()
    this.requestPasswordResetRoute()
    this.confirmPasswordResetRoute()
    this.resetPasswordRoute()
    return this.router
  }
}
