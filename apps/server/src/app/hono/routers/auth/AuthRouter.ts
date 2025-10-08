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

const ROUTE_PREFIX = '/auth'

export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath(ROUTE_PREFIX)
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()
  static readonly ROUTE_PREFIX = ROUTE_PREFIX
  static readonly ROUTES = {
    signIn: '/sign-in',
    signUp: '/sign-up',
    signOut: '/sign-out',
    signInWithGoogle: '/sign-in/google',
    signInWithGithub: '/sign-in/github',
    signUpWithSocialAccount: '/sign-up/social-account',
    account: '/account',
    socialAccount: '/social-account',
    socialAccountGoogle: '/social-account/google',
    socialAccountGithub: '/social-account/github',
    socialAccountGithubConnection: '/social-account/github/connection',
    socialAccountGoogleConnection: '/social-account/google/connection',
    refreshSession: '/refresh-session',
    resendSignUpEmail: '/resend-email/sign-up',
    requestPasswordReset: '/request-password-reset',
    confirmEmail: '/confirm-email',
    confirmPasswordReset: '/confirm-password-reset',
    resetPassword: '/reset-password',
  } as const

  private registerSignInRoute(): void {
    this.router.post(
      AuthRouter.ROUTES.signIn,
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
      AuthRouter.ROUTES.signUp,
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
    this.router.delete(AuthRouter.ROUTES.signOut, async (context) => {
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
      AuthRouter.ROUTES.signInWithGoogle,
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
      AuthRouter.ROUTES.signInWithGithub,
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
      AuthRouter.ROUTES.signUpWithSocialAccount,
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
      AuthRouter.ROUTES.socialAccountGoogle,
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
      AuthRouter.ROUTES.socialAccountGithub,
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
    this.router.delete(AuthRouter.ROUTES.socialAccountGithub, async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new DisconnectGithubAccountController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerDisconnectGoogleAccountRoute(): void {
    this.router.delete(AuthRouter.ROUTES.socialAccountGoogle, async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new DisconnectGoogleAccountController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchGithubAccountConnectionRoute(): void {
    this.router.get(AuthRouter.ROUTES.socialAccountGithubConnection, async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchGithubAccountConnectionController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchGoogleAccountConnectionRoute(): void {
    this.router.get(AuthRouter.ROUTES.socialAccountGoogleConnection, async (context) => {
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
      AuthRouter.ROUTES.resendSignUpEmail,
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
      AuthRouter.ROUTES.refreshSession,
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
      AuthRouter.ROUTES.requestPasswordReset,
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
      AuthRouter.ROUTES.confirmEmail,
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
      AuthRouter.ROUTES.confirmPasswordReset,
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
      AuthRouter.ROUTES.resetPassword,
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
    this.router.get(AuthRouter.ROUTES.account, async (context) => {
      const http = new HonoHttp(context)
      const supabase = http.getSupabase()
      const service = new SupabaseAuthService(supabase)
      const controller = new FetchSessionController(service)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchSocialAccountRoute(): void {
    this.router.get(AuthRouter.ROUTES.socialAccount, async (context) => {
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
