import { Hono } from 'hono'
import { z } from 'zod'

import { idSchema, stringSchema } from '@stardust/validation/global/schemas'
import { chatMessageSchema } from '@stardust/validation/conversation/schemas'

import {
  FetchChatMessagesController,
  SendChatMessageController,
  EditChatNameController,
  DeleteChatController,
} from '@/rest/controllers/conversation'

import { SupabaseChatsRepository } from '@/database/supabase/repositories/conversation/SupabaseChatsRepository'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'
import { AuthMiddleware, ValidationMiddleware } from '../../middlewares'

export class ChatsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/chats')
  private readonly authMiddleware = new AuthMiddleware()
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerFetchChatMessagesRoute(): void {
    this.router.get(
      '/:chatId/messages',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          chatId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChatsRepository(http.getSupabase())
        const controller = new FetchChatMessagesController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerSendChatMessageRoute(): void {
    this.router.post(
      '/:chatId/messages',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          chatId: idSchema,
        }),
      ),
      this.validationMiddleware.validate('json', chatMessageSchema),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChatsRepository(http.getSupabase())
        const controller = new SendChatMessageController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerEditChatNameRoute(): void {
    this.router.patch(
      '/:chatId/name',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          chatId: idSchema,
        }),
      ),
      this.validationMiddleware.validate(
        'json',
        z.object({
          chatName: stringSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChatsRepository(http.getSupabase())
        const controller = new EditChatNameController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  private registerDeleteChatRoute(): void {
    this.router.delete(
      '/:chatId',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'param',
        z.object({
          chatId: idSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChatsRepository(http.getSupabase())
        const controller = new DeleteChatController(repository)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerFetchChatMessagesRoute()
    this.registerSendChatMessageRoute()
    this.registerEditChatNameRoute()
    this.registerDeleteChatRoute()
    return this.router
  }
}
