import type { Context, Next } from 'hono'

import { SupabaseUsersRepository } from '@/database'
import { AppendUserCompletedChallengesIdsToBodyController } from '@/rest/controllers/profile/users'
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
}
