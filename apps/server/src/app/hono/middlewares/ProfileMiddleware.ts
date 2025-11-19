import type { Context, Next } from 'hono'

import { SupabaseUsersRepository } from '@/database'
import {
  AppendUserCompletedChallengesIdsToBodyController,
  AppendIsSolutionUpvotedToBodyController,
  AppendUserInfoToBodyController,
  VerifyUserSocialAccountController,
  CompleteSpaceController,
} from '@/rest/controllers/profile/users'
import { HonoHttp } from '../HonoHttp'
import { InngestEventBroker } from '@/queue/inngest/InngestEventBroker'
import { VerifyUserInsigniaController } from '@/rest/controllers/profile/users/VerifyUserInsigniaController'
import { InsigniaRole } from '@stardust/core/global/structures'

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

  async verifyUserEngineerInsignia(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new VerifyUserInsigniaController(
      InsigniaRole.createAsEngineer(),
      usersRepository,
    )
    await controller.handle(http)
  }

  async appendUserInfoToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new SupabaseUsersRepository(http.getSupabase())
    const controller = new AppendUserInfoToBodyController(usersRepository)
    await controller.handle(http)
  }

  async completeSpace(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const repository = new SupabaseUsersRepository(http.getSupabase())
    const eventBroker = new InngestEventBroker()
    const controller = new CompleteSpaceController(repository, eventBroker)
    await controller.handle(http)
  }
}
