import type { Context, Next } from 'hono'

import { DrizzleChallengesRepository } from '@/database/drizzle/repositories'
import { DrizzleUsersRepository } from '@/database/drizzle/repositories'
import {
  AppendChallengeRewardToBodyController,
  VerifyChallengeManagementPermissionController,
} from '@/rest/controllers/challenging/challenges'
import { HonoHttp } from '../HonoHttp'

export class ChallengingMiddleware {
  async appendChallengeRewardToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const repository = new DrizzleChallengesRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendChallengeRewardToBodyController(repository)
    await controller.handle(http)
  }

  async verifyChallengeManagementPermission(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const challengesRepository = new DrizzleChallengesRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyChallengeManagementPermissionController(
      challengesRepository,
      usersRepository,
    )

    await controller.handle(http)
  }
}
