import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema } from '@stardust/validation/global/schemas'
import { achievementSchema } from '@stardust/validation/profile/schemas'

import {
  FetchAllAchievementsController,
  FetchAllUnlockedAchievementsController,
  ObserveNewUnlockedAchievementsController,
  RescueAchievementController,
  CreateAchievementController,
  UpdateAchievementController,
  DeleteAchievementController,
  ReorderAchievementsController,
} from '@/rest/controllers/profile/achievements'
import {
  SupabaseAchievementsRepository,
  SupabaseUsersRepository,
} from '@/database/supabase/repositories/profile'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class AchievementsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/achievements')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

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
      this.validationMiddleware.validate(
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
      this.validationMiddleware.validate(
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
      this.validationMiddleware.validate(
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

  private createAchievementRoute(): void {
    this.router.post(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate('json', achievementSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new CreateAchievementController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private updateAchievementRoute(): void {
    this.router.put(
      '/:achievementId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          achievementId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', achievementSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new UpdateAchievementController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private deleteAchievementRoute(): void {
    this.router.delete(
      '/:achievementId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          achievementId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new DeleteAchievementController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private reorderAchievementsRoute(): void {
    this.router.patch(
      '/order',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'json',
        z.object({
          achievementIds: z.array(idSchema),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseAchievementsRepository(http.getSupabase())
        const controller = new ReorderAchievementsController(repository)
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
    this.createAchievementRoute()
    this.updateAchievementRoute()
    this.deleteAchievementRoute()
    this.reorderAchievementsRoute()
    return this.router
  }
}
