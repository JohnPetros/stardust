import type { Context, Next } from 'hono'

import { SupabaseChallengesRepository } from '@/database/supabase/repositories/challenging'
import { AppendChallengeRewardToBodyController } from '@/rest/controllers/challenging/challenges'
import { HonoHttp } from '../HonoHttp'

export class ChallengingMiddleware {
  async appendChallengeRewardToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const repository = new SupabaseChallengesRepository(http.getSupabase())
    const controller = new AppendChallengeRewardToBodyController(repository)
    await controller.handle(http)
  }
}
