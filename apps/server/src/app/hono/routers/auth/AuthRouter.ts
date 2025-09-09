import { Hono } from 'hono'
import { z } from 'zod'

import {
  emailSchema,
  nameSchema,
  passwordSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { accountSchema } from '@stardust/validation/auth/schemas'

import {
  ConfirmPasswordResetController,
  RequestPasswordResetController,
  ResetPasswordController,
  SignInController,
  SignInWithGoogleAccountController,
  SignOutController,
  SignUpController,
  FetchSessionController,
  ConfirmEmailController,
  ResendSignUpEmailController,
  RefreshSessionController,
  FetchSocialAccountController,
  SignUpWithSocialAccountController,
  SignInWithGithubAccountController,
  ConnectGoogleAccountController,
  ConnectGithubAccountController,
  DisconnectGithubAccountController,
  DisconnectGoogleAccountController,
  FetchGithubAccountConnectionController,
  FetchGoogleAccountConnectionController,
} from '@/rest/controllers/auth'
import { SupabaseAuthService } from '@/rest/services'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import {
  AuthMiddleware,
  ProfileMiddleware,
  ValidationMiddleware,
} from '../../middlewares'

export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/auth')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

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

  private registerSignInWithGoogleRoute(): void {
    this.router.get(
      '/sign-in/google',
      this.validationMiddleware.validate(
        'query',
        z.object({
          returnUrl: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new SignInWithGoogleAccountController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerSignInWithGithubRoute(): void {
    this.router.get(
      '/sign-in/github',
      this.validationMiddleware.validate(
        'query',
        z.object({
          returnUrl: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new SignInWithGithubAccountController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerSignUpWithSocialAccountRoute(): void {
    this.router.post(
      '/sign-up/social-account',
      this.validationMiddleware.validate('json', accountSchema),
      this.profileMiddleware.verifyUserSocialAccount,
      async (context) => {
        const http = new HonoHttp(context)
        const eventBroker = new InngestEventBroker()
        const controller = new SignUpWithSocialAccountController(eventBroker)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerConnectGoogleAccountRoute(): void {
    this.router.post(
      '/social-account/google',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          returnUrl: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ConnectGoogleAccountController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerConnectGithubAccountRoute(): void {
    this.router.post(
      '/social-account/github',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          returnUrl: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const service = new SupabaseAuthService(supabase)
        const controller = new ConnectGithubAccountController(service)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDisconnectGithubAccountRoute(): void {
    this.router.delete('/social-account/github', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new DisconnectGithubAccountController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerDisconnectGoogleAccountRoute(): void {
    this.router.delete('/social-account/google', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new DisconnectGoogleAccountController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchGithubAccountConnectionRoute(): void {
    this.router.get('/social-account/github/connection', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchGithubAccountConnectionController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchGoogleAccountConnectionRoute(): void {
    this.router.get('/social-account/google/connection', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchGoogleAccountConnectionController(service)
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

  private registerFetchSocialAccountRoute(): void {
    this.router.get('/social-account', async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchSocialAccountController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.registerSignInRoute()
    this.registerSignUpRoute()
    this.registerSignOutRoute()
    this.registerSignInWithGoogleRoute()
    this.registerSignInWithGithubRoute()
    this.registerResendSignUpEmailRoute()
    this.registerRefreshSessionRoute()
    this.registerRequestPasswordResetRoute()
    this.registerSignUpWithSocialAccountRoute()
    this.registerConnectGoogleAccountRoute()
    this.registerConnectGithubAccountRoute()
    this.registerDisconnectGithubAccountRoute()
    this.registerDisconnectGoogleAccountRoute()
    this.registerFetchGithubAccountConnectionRoute()
    this.registerFetchGoogleAccountConnectionRoute()
    this.registerConfirmEmailRoute()
    this.registerConfirmPasswordResetRoute()
    this.registerResetPasswordRoute()
    this.registerFetchAccountRoute()
    this.registerFetchSocialAccountRoute()
    return this.router
  }
}
