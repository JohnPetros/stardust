import { Hono } from 'hono'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { OnboardingMiddleware } from '../../middlewares/OnboardingMiddleware'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories'
import { FetchOnboardingAttemptController } from '@/rest/controllers/profile/FetchOnboardingAttemptController'

export class OnboardingAttemptsRouter extends HonoRouter {
  registerRoutes(): Hono {
    const router = new Hono()
    const middleware = new OnboardingMiddleware()
    router.get('/onboarding-attempt', middleware.authorizeAttempt, async (context) => {
      const http = new HonoHttp(context)
      const repository = new DrizzleUsersRepository(
        http.getDatabase(),
        http.getDatabaseAccess(),
      )
      return http.sendResponse(
        await new FetchOnboardingAttemptController(
          repository,
          context.get('onboardingAttempt'),
        ).handle(http),
      )
    })
    return router
  }
}
