import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  emailSchema,
  idSchema,
  integerSchema,
  nameSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'
import { userSchema } from '@stardust/validation/profile/schemas'

import { SupabaseUsersRepository } from '@/database'
import {
  FetchUserController,
  AcquireAvatarController,
  AcquireRocketController,
  VerifyUserNameInUseController,
  VerifyUserEmailInUseController,
  UpdateUserController,
  RewardUserForStarCompletionController,
  RewardUserForStarChallengeCompletionController,
  RewardUserForChallengeCompletionController,
} from '@/rest/controllers/profile'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { AuthMiddleware, SpaceMiddleware, ChallengingMiddleware } from '../../middlewares'

export class UsersRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/users')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly spaceMiddleware = new SpaceMiddleware()
  private readonly challengingMiddleware = new ChallengingMiddleware()

  private registerFetchUserByIdRoute() {
    this.router.get(
      '/id/:userId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          userId: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new FetchUserController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchUserBySlugRoute() {
    this.router.get(
      '/slug/:userSlug',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          userSlug: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new FetchUserController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerUpdateUserRoute() {
    this.router.put(
      '/:userId',
      this.authMiddleware.verifyAuthentication,
      zValidator('param', userSchema),
      zValidator('json', userSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new UpdateUserController(repository)
        // const response = await controller.handle(http)
        return http.sendResponse(http.send())
      },
    )
  }

  private registerRewardUserForStarCompletionRoute() {
    this.router.put(
      '/:userId/reward/star',
      this.authMiddleware.verifyAuthentication,
      this.spaceMiddleware.appendNextStarToBody,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          starId: idSchema,
          questionsCount: integerSchema,
          incorrectAnswersCount: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new RewardUserForStarCompletionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRewardUserForStarChallengeCompletionRoute() {
    this.router.put(
      '/:userId/reward/star-challenge',
      this.authMiddleware.verifyAuthentication,
      this.challengingMiddleware.appendChallengeRewardToBody,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          challengeId: idSchema,
          maximumIncorrectAnswersCount: integerSchema,
          incorrectAnswersCount: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new RewardUserForStarChallengeCompletionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerRewardUserForChallengeCompletionRoute() {
    this.router.put(
      '/:userId/reward/challenge',
      this.authMiddleware.verifyAuthentication,
      this.challengingMiddleware.appendChallengeRewardToBody,
      zValidator(
        'param',
        z.object({
          userId: idSchema,
        }),
      ),
      zValidator(
        'json',
        z.object({
          challengeId: idSchema,
          maximumIncorrectAnswersCount: integerSchema,
          incorrectAnswersCount: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new RewardUserForChallengeCompletionController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerAcquireRocketRoute() {
    this.router.post(
      '/rockets/acquire',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'json',
        z.object({
          rocketId: idSchema,
          rocketName: nameSchema,
          rocketImage: stringSchema,
          rocketPrice: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new AcquireRocketController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerAcquireAvatarRoute() {
    this.router.post(
      '/avatars/acquire',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'json',
        z.object({
          avatarId: idSchema,
          avatarName: nameSchema,
          avatarImage: stringSchema,
          avatarPrice: integerSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new AcquireAvatarController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerVerifyUserNameInUseRoute() {
    this.router.get(
      '/verify-name-in-use',
      zValidator(
        'query',
        z.object({
          name: nameSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new VerifyUserNameInUseController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerVerifyUserEmailInUseRoute() {
    this.router.get(
      '/verify-email-in-use',
      zValidator(
        'query',
        z.object({
          email: emailSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseUsersRepository(http.getSupabase())
        const controller = new VerifyUserEmailInUseController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchUserByIdRoute()
    this.registerFetchUserBySlugRoute()
    this.registerUpdateUserRoute()
    this.registerRewardUserForStarCompletionRoute()
    this.registerRewardUserForStarChallengeCompletionRoute()
    this.registerRewardUserForChallengeCompletionRoute()
    this.registerAcquireAvatarRoute()
    this.registerAcquireRocketRoute()
    this.registerVerifyUserNameInUseRoute()
    this.registerVerifyUserEmailInUseRoute()
    return this.router
  }
}
