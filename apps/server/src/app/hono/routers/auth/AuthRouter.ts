import { NodeOnboardingReceiptProvider } from '@/provision/auth/NodeOnboardingReceiptProvider'
import { ENV } from '@/constants'
import { Hono, type Context } from 'hono'
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
  SignInGodAccountController,
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
  RetryUserCreationController,
} from '@/rest/controllers/auth'
import { SupabaseAuthService } from '@/rest/services'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { ApiKeysRouter } from './ApiKeysRouter'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware'
import { ProfileMiddleware } from '../../middlewares/ProfileMiddleware'
import { ValidationMiddleware } from '../../middlewares/ValidationMiddleware'

export class AuthRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/auth')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()
  private readonly profileMiddleware = new ProfileMiddleware()

  private registerSignInRoute(): void {
    this.registerSignInPath(
      '/sign-in',
      (service) => new SignInController(service, new InngestBroker()),
    )
  }

  private registerSignInGodAccountRoute(): void {
    this.registerSignInPath(
      '/sign-in/god',
      (service) => new SignInGodAccountController(service),
    )
  }

  private registerSignInPath(
    path: string,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => SignInController | SignInGodAccountController,
  ): void {
    this.router.post(
      path,
      this.validationMiddleware.validate('json', credentialsSignInSchema),
      (context) => this.handleSignInPath(context, controllerFactory),
    )
  }

  private async handleSignInPath(
    context: Context,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => SignInController | SignInGodAccountController,
  ) {
    const http = new HonoHttp(context)
    const service = new SupabaseAuthService(http.getSupabase())
    const controller = controllerFactory(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
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
        const Broker = new InngestBroker()
        const controller = new SignUpController(
          service,
          Broker,
          new NodeOnboardingReceiptProvider(ENV.onboardingReceiptSecret),
        )
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
    this.registerSocialSignInPath(
      '/sign-in/google',
      (service) => new SignInWithGoogleAccountController(service),
    )
  }

  private registerSignInWithGithubRoute(): void {
    this.registerSocialSignInPath(
      '/sign-in/github',
      (service) => new SignInWithGithubAccountController(service),
    )
  }

  private registerSignUpWithSocialAccountRoute(): void {
    this.router.post(
      '/sign-up/social-account',
      this.validationMiddleware.validate('json', accountSchema),
      this.profileMiddleware.verifyUserSocialAccount,
      (context) => this.handleSignUpWithSocialAccount(context),
    )
  }

  private async handleSignUpWithSocialAccount(context: Context) {
    const http = new HonoHttp(context)
    const Broker = new InngestBroker()
    const controller = new SignUpWithSocialAccountController(Broker)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private registerSocialSignInPath(
    path: string,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => SignInWithGoogleAccountController | SignInWithGithubAccountController,
  ): void {
    this.router.get(
      path,
      this.validationMiddleware.validate('query', socialSignInQuerySchema),
      (context) => this.handleSocialSignInPath(context, controllerFactory),
    )
  }

  private async handleSocialSignInPath(
    context: Context,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => SignInWithGoogleAccountController | SignInWithGithubAccountController,
  ) {
    const http = new HonoHttp(context)
    const service = new SupabaseAuthService(http.getSupabase())
    const controller = controllerFactory(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private registerConnectGoogleAccountRoute(): void {
    this.registerSocialAccountConnectionPath(
      '/social-account/google',
      (service) => new ConnectGoogleAccountController(service),
    )
  }

  private registerConnectGithubAccountRoute(): void {
    this.registerSocialAccountConnectionPath(
      '/social-account/github',
      (service) => new ConnectGithubAccountController(service),
    )
  }

  private registerSocialAccountConnectionPath(
    path: string,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ConnectGoogleAccountController | ConnectGithubAccountController,
  ): void {
    this.router.post(
      path,
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('query', socialSignInQuerySchema),
      (context) => this.handleSocialAccountConnectionPath(context, controllerFactory),
    )
  }

  private async handleSocialAccountConnectionPath(
    context: Context,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ConnectGoogleAccountController | ConnectGithubAccountController,
  ) {
    const http = new HonoHttp(context)
    const supabase = http.getSupabase()
    const service = new SupabaseAuthService(supabase)
    const controller = controllerFactory(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
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
    this.registerEmailActionPath(
      '/resend-email/sign-up',
      (service) => new ResendSignUpEmailController(service),
    )
  }

  private registerRefreshSessionRoute(): void {
    this.router.post(
      '/refresh-session',
      this.validationMiddleware.validate('json', refreshSessionSchema),
      (context) => this.handleRefreshSessionPath(context),
    )
  }

  private async handleRefreshSessionPath(context: Context) {
    const http = new HonoHttp(context)
    const supabase = http.getSupabase()
    const service = new SupabaseAuthService(supabase)
    const controller = new RefreshSessionController(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private registerRequestPasswordResetRoute(): void {
    this.registerEmailActionPath(
      '/request-password-reset',
      (service) => new RequestPasswordResetController(service),
    )
  }

  private registerEmailActionPath(
    path: string,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ResendSignUpEmailController | RequestPasswordResetController,
  ): void {
    this.router.post(
      path,
      this.validationMiddleware.validate('json', emailOnlySchema),
      (context) => this.handleEmailActionPath(context, controllerFactory),
    )
  }

  private async handleEmailActionPath(
    context: Context,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ResendSignUpEmailController | RequestPasswordResetController,
  ) {
    const http = new HonoHttp(context)
    const service = new SupabaseAuthService(http.getSupabase())
    const controller = controllerFactory(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private registerConfirmEmailRoute(): void {
    this.registerConfirmationPath(
      '/confirm-email',
      (service) => new ConfirmEmailController(service, new InngestBroker()),
    )
  }

  private registerConfirmPasswordResetRoute(): void {
    this.registerConfirmationPath(
      '/confirm-password-reset',
      (service) => new ConfirmPasswordResetController(service),
    )
  }

  private registerConfirmationPath(
    path: string,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ConfirmEmailController | ConfirmPasswordResetController,
  ): void {
    this.router.post(
      path,
      this.validationMiddleware.validate('json', confirmationTokenSchema),
      (context) => this.handleConfirmationPath(context, controllerFactory),
    )
  }

  private async handleConfirmationPath(
    context: Context,
    controllerFactory: (
      service: SupabaseAuthService,
    ) => ConfirmEmailController | ConfirmPasswordResetController,
  ) {
    const http = new HonoHttp(context)
    const supabase = http.getSupabase()
    const service = new SupabaseAuthService(supabase)
    const controller = controllerFactory(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  private registerResetPasswordRoute(): void {
    this.router.patch(
      '/reset-password',
      this.validationMiddleware.validate('json', resetPasswordSchema),
      (context) => this.handleResetPasswordPath(context),
    )
  }

  private async handleResetPasswordPath(context: Context) {
    const http = new HonoHttp(context)
    const supabase = http.getSupabase()
    const service = new SupabaseAuthService(supabase)
    const controller = new ResetPasswordController(service)
    const response = await controller.handle(http)
    return http.sendResponse(response)
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

  private registerRetryUserCreationRoute(): void {
    this.router.post(
      '/sign-up/retry',
      this.authMiddleware.verifyAuthentication,
      this.profileMiddleware.verifyUserAbsence,
      (context) => this.handleRetryUserCreation(context),
    )
  }

  private async handleRetryUserCreation(context: Context) {
    const http = new HonoHttp(context)
    const service = new SupabaseAuthService(http.getSupabase())
    const broker = new InngestBroker()
    const controller = new RetryUserCreationController(service, broker)
    const response = await controller.handle(http)
    return http.sendResponse(response)
  }

  registerRoutes(): Hono {
    const apiKeysRouter = new ApiKeysRouter(this.app)

    this.registerSignInRoute()
    this.registerSignUpRoute()
    this.registerSignOutRoute()
    this.registerSignInGodAccountRoute()
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
    this.registerRetryUserCreationRoute()
    this.router.route('/', apiKeysRouter.registerRoutes())
    return this.router
  }
}

const credentialsSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

const socialSignInQuerySchema = z.object({ returnUrl: stringSchema })

const emailOnlySchema = z.object({ email: emailSchema })

const refreshSessionSchema = z.object({ refreshToken: stringSchema })

const confirmationTokenSchema = z.object({ token: z.string() })

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
})
