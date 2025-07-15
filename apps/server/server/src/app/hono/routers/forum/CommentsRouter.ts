import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import {
  idSchema,
  itemsPerPageSchema,
  pageSchema,
  stringSchema,
} from '@stardust/validation/global/schemas'

import { SupabaseCommentsRepository } from '@/database/supabase/repositories/forum'
import {
  DeleteCommentController,
  EditCommentController,
  FetchChallengeCommentsListController,
  FetchCommentRepliesController,
  FetchSolutionCommentsListController,
  PostChallengeCommentController,
  PostSolutionCommentController,
  ReplyCommentController,
} from '@/rest/controllers/forum/comments'
import { AuthMiddleware } from '../../middlewares'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'

export class CommentsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/comments')
  private readonly authMiddleware = new AuthMiddleware()

  private registerFetchSolutionCommentsListRoute(): void {
    this.router.get(
      '/solution/:solutionId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionId: idSchema,
        }),
      ),
      zValidator(
        'query',
        z.object({
          sorter: stringSchema,
          order: stringSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new FetchSolutionCommentsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchChallengeCommentsListRoute(): void {
    this.router.get(
      '/challenge/:challengeId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      zValidator(
        'query',
        z.object({
          sorter: stringSchema,
          order: stringSchema,
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new FetchChallengeCommentsListController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerFetchCommentRepliesRoute(): void {
    this.router.get(
      '/:commentId/replies',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          commentId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new FetchCommentRepliesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerPostChallengeCommentRoute(): void {
    this.router.post(
      '/challenge/:challengeId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          challengeId: idSchema,
        }),
      ),
      zValidator('json', z.object({ content: stringSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new PostChallengeCommentController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerPostSolutionCommentRoute(): void {
    this.router.post(
      '/solution/:solutionId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          solutionId: idSchema,
        }),
      ),
      zValidator('json', z.object({ content: stringSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new PostSolutionCommentController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerReplyCommentRoute(): void {
    this.router.post(
      '/:commentId/replies',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          commentId: idSchema,
        }),
      ),
      zValidator('json', z.object({ content: stringSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new ReplyCommentController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditCommentRoute(): void {
    this.router.patch(
      '/:commentId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          commentId: idSchema,
        }),
      ),
      zValidator('json', z.object({ content: stringSchema })),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new EditCommentController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteCommentRoute(): void {
    this.router.delete(
      '/:commentId',
      this.authMiddleware.verifyAuthentication,
      zValidator(
        'param',
        z.object({
          commentId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseCommentsRepository(http.getSupabase())
        const controller = new DeleteCommentController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchSolutionCommentsListRoute()
    this.registerFetchChallengeCommentsListRoute()
    this.registerFetchCommentRepliesRoute()
    this.registerPostChallengeCommentRoute()
    this.registerPostSolutionCommentRoute()
    this.registerReplyCommentRoute()
    this.registerEditCommentRoute()
    this.registerDeleteCommentRoute()
    return this.router
  }
}
