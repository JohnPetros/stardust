import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'

import {
  FetchAllAchievementsController,
  FetchAllUnlockedAchievementsController,
  RescueAchievementController,
} from '@/rest/controllers/profile/achievements'
import {
  SupabaseAchievementsRepository,
  SupabaseUsersRepository,
} from '@/database/supabase/repositories'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import type { HonoSchema } from '../../types'

export class AchievementsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/achievements')

  private fetchAchievementsRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseAchievementsRepository(http.getSupabase())
      const controller = new FetchAllAchievementsController(repository)
      const response = await controller.handle(http)
      return this.app.sendRestResponse(response)
    })
  }

  private fetchUnlockedAchievementsRoute(): void {
    this.router.get(
      '/:userId',
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp<HonoSchema<typeof context>>(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new FetchAllUnlockedAchievementsController(repository)
        const response = await controller.handle(http)
        return this.app.sendRestResponse(response)
      },
    )
  }

  private rescueAchievementRoute(): void {
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
        const achievementsRepository = new SupabaseAchievementsRepository(supabase)
        const usersRepository = new SupabaseUsersRepository(supabase)
        const controller = new RescueAchievementController(
          achievementsRepository,
          usersRepository,
        )
        const response = await controller.handle(http)
        return this.app.sendRestResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.fetchAchievementsRoute()
    this.fetchUnlockedAchievementsRoute()
    this.rescueAchievementRoute()
    return this.router
  }
}
