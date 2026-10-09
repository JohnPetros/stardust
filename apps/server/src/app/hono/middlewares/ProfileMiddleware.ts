import type { Context, Next } from 'hono'

import { DrizzleUsersRepository } from '@/database/drizzle/repositories'
import {
  AppendUserCompletedChallengesIdsToBodyController,
  AppendIsSolutionUpvotedToBodyController,
  AppendUserInfoToBodyController,
  VerifyUserSocialAccountController,
  VerifyUserAbsenceController,
  CompleteSpaceController,
} from '@/rest/controllers/profile/users'
import { SupabaseAuthService } from '@/rest/services'
import { HonoHttp } from '../HonoHttp'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { VerifyUserInsigniaController } from '@/rest/controllers/profile/users/VerifyUserInsigniaController'
import { InsigniaRole } from '@stardust/core/global/structures'

export class ProfileMiddleware {
  async appendUserCompletedChallengesIdsToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendUserCompletedChallengesIdsToBodyController(
      usersRepository,
    )
    await controller.handle(http)
  }

  async appendIsSolutionUpvotedToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendIsSolutionUpvotedToBodyController(usersRepository)
    await controller.handle(http)
  }

  async verifyUserSocialAccount(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyUserSocialAccountController(usersRepository)
    await controller.handle(http)
  }

  async verifyUserEngineerInsignia(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyUserInsigniaController(
      [InsigniaRole.createAsEngineer()],
      usersRepository,
    )
    await controller.handle(http)
  }

  async verifyUserEngineerOrGodInsignia(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyUserInsigniaController(
      [InsigniaRole.createAsEngineer(), InsigniaRole.createAsGod()],
      usersRepository,
    )
    await controller.handle(http)
  }

  async appendUserInfoToBody(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new AppendUserInfoToBodyController(usersRepository)
    await controller.handle(http)
  }

  async verifyUserAbsence(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const authService = new SupabaseAuthService(http.getSupabase())
    const usersRepository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const controller = new VerifyUserAbsenceController(authService, usersRepository)
    await controller.handle(http)
  }

  async completeSpace(context: Context, next: Next) {
    const http = new HonoHttp(context, next)
    const repository = new DrizzleUsersRepository(
      http.getDatabase(),
      http.getDatabaseAccess(),
    )
    const Broker = new InngestBroker()
    const controller = new CompleteSpaceController(repository, Broker)
    await controller.handle(http)
  }
}
