import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import {
  FetchAllAchievementsController,
  FetchAllUnlockedAchievementsController,
  ObserveNewUnlockedAchievementsController,
  RescueAchievementController,
} from '@/rest/controllers/profile/achievements'
import {
  SupabaseAchievementsRepository,
  SupabaseUsersRepository,
} from '@/database/supabase/repositories/profile'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware } from '../../middlewares'

export class AchievementsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/achievements')
  private readonly authMiddleware = new AuthMiddleware()

  private fetchAchievementsRoute(): void {
    this.router.get('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseAchievementsRepository(http.getSupabase())
      const controller = new FetchAllAchievementsController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private fetchUnlockedAchievementsRoute(): void {
    this.router.get(
      '/:userId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new FetchAllUnlockedAchievementsController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private observeNewUnlockedAchievementsRoute(): void {
    this.router.post(
      '/:userId/observe',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const achievementsRepository = new SupabaseAchievementsRepository(supabase)
        const usersRepository = new SupabaseUsersRepository(supabase)
        const controller = new ObserveNewUnlockedAchievementsController(
          achievementsRepository,
          usersRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private rescueAchievementRoute(): void {
    this.router.put(
      '/:userId/:achievementId/rescue',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
          achievementId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const supabase = http.getSupabase()
        const achievementsRepository = new SupabaseAchievementsRepository(supabase)
        const usersRepository = new SupabaseUsersRepository(supabase)
        const controller = new RescueAchievementController(
          achievementsRepository,
          usersRepository,
        )
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchAchievementsRoute()
    this.fetchUnlockedAchievementsRoute()
    this.observeNewUnlockedAchievementsRoute()
    this.rescueAchievementRoute()
    return this.router
  }
}
