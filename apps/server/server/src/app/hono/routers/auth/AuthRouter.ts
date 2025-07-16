import { Hono } from 'hono'
import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import {
  ConfirmPasswordResetController,
  RequestPasswordResetController,
  ResetPasswordController,
  SignInController,
  SignOutController,
  SignUpController,
  FetchSessionController,
  ConfirmEmailController,
  ResendSignUpEmailController,
  RefreshSessionController,
} from '@/rest/controllers/auth'
import { SupabaseAuthService } from '@/rest/services'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { ValidationMiddleware } from '../../middlewares'

export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/auth')
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerSignInRoute(): void {
    this.router.post(
      '/sign-in',
      this.validationMiddleware.validate(
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

  private registerSignUpRoute(): void {
    this.router.post(
      '/sign-up',
      this.validationMiddleware.validate(
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

  private registerSignOutRoute(): void {
    this.router.delete('/sign-out', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new SignOutController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerResendSignUpEmailRoute(): void {
    this.router.post(
      '/resend-email/sign-up',
      this.validationMiddleware.validate(
        'json',
        z.object({
          email: emailSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ResendSignUpEmailController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRefreshSessionRoute(): void {
    this.router.post(
      '/refresh-session',
      this.validationMiddleware.validate(
        'json',
        z.object({
          refreshToken: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new RefreshSessionController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRequestPasswordResetRoute(): void {
    this.router.post(
      '/request-password-reset',
      this.validationMiddleware.validate(
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

  private registerConfirmEmailRoute(): void {
    this.router.post(
      '/confirm-email',
      this.validationMiddleware.validate(
        'json',
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

  private registerConfirmPasswordResetRoute(): void {
    this.router.post(
      '/confirm-password-reset',
      this.validationMiddleware.validate(
        'json',
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

  private registerResetPasswordRoute(): void {
    this.router.patch(
      '/reset-password',
      this.validationMiddleware.validate(
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

  private registerFetchAccountRoute(): void {
    this.router.get('/account', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchSessionController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.registerSignInRoute()
    this.registerSignUpRoute()
    this.registerSignOutRoute()
    this.registerResendSignUpEmailRoute()
    this.registerRefreshSessionRoute()
    this.registerRequestPasswordResetRoute()
    this.registerConfirmEmailRoute()
    this.registerConfirmPasswordResetRoute()
    this.registerResetPasswordRoute()
    this.registerFetchAccountRoute()
    return this.router
  }
}
