import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import { DrizzleRankersRepository } from '@/database/drizzle/repositories'
import {
  FetchLastWeekRankingWinnersController,
  FetchRankingController,
} from '@/rest/controllers/ranking'
import { DrizzleTiersRepository } from '@/database/drizzle/repositories'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { TiersRouter } from './TiersRouter'

export class RankingRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/ranking')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchRankersRoute(): void {
    this.router.get(
      '/rankers/:tierId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ tierId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const rankersRepository = new DrizzleRankersRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const tiersRepository = new DrizzleTiersRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new FetchRankingController(tiersRepository, rankersRepository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchLastWeekRankingWinnersRoute(): void {
    this.router.get(
      '/winners/:tierId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('param', z.object({ tierId: idSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const rankersRepository = new DrizzleRankersRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const tiersRepository = new DrizzleTiersRepository(
          http.getDatabase(),
          http.getDatabaseAccess(),
        )
        const controller = new FetchLastWeekRankingWinnersController(
          tiersRepository,
          rankersRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    const tiersRouter = new TiersRouter(this.app)
    this.router.route('/', tiersRouter.registerRoutes())
    this.registerFetchRankersRoute()
    this.registerFetchLastWeekRankingWinnersRoute()
    return this.router
  }
}
