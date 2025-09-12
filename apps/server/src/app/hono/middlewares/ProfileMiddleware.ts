import type { Context, Next } from 'hono'

import { SupabaseUsersRepository } from '@/database'
import {
  AppendUserCompletedChallengesIdsToBodyController,
  AppendUserInfoToBodyController,
} from '@/rest/controllers/profile/users'
import { AppendIsSolutionUpvotedToBodyController } from '@/rest/controllers/profile/users'
import { VerifyUserSocialAccountController } from '@/rest/controllers/profile/users'
import { HonoHttp } from '../HonoHttp'

export class ProfileMiddleware {
  async appendUserCompletedChallengesIdsToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new AppendUserCompletedChallengesIdsToBodyController(
      usersRepository,
    )
    await controller.handle(http)
  }

  async appendIsSolutionUpvotedToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new AppendIsSolutionUpvotedToBodyController(usersRepository)
    await controller.handle(http)
  }

  async verifyUserSocialAccount(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new VerifyUserSocialAccountController(usersRepository)
    await controller.handle(http)
  }

  async appendUserInfoToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new AppendUserInfoToBodyController(usersRepository)
    await controller.handle(http)
  }
}
