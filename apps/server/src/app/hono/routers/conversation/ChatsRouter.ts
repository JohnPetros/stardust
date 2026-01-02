import { Hono } from 'hono'
import { z } from 'zod'

import {
  idSchema,
  stringSchema,
  searchSchema,
  pageSchema,
  itemsPerPageSchema,
} from '@stardust/validation/global/schemas'
import { chatMessageSchema } from '@stardust/validation/conversation/schemas'

import {
  FetchChatMessagesController,
  SendChatMessageController,
  EditChatNameController,
  DeleteChatController,
  CreateChatController,
  FetchChatsController,
} from '@/rest/controllers/conversation'

import {
  SupabaseChatMessagesRepository,
  SupabaseChatsRepository,
} from '@/database/supabase/repositories/conversation'
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
        const chatsRepository = new SupabaseChatsRepository(http.getSupabase())
        const chatMessagesRepository = new SupabaseChatMessagesRepository(
          http.getSupabase(),
        )
        const controller = new FetchChatMessagesController(
          chatsRepository,
          chatMessagesRepository,
        )
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
        const chatsRepository = new SupabaseChatsRepository(http.getSupabase())
        const chatMessagesRepository = new SupabaseChatMessagesRepository(
          http.getSupabase(),
        )
        const controller = new SendChatMessageController(
          chatsRepository,
          chatMessagesRepository,
        )
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

  private registerCreateChatRoute(): void {
    this.router.post('/', this.authMiddleware.verifyAuthentication, async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseChatsRepository(http.getSupabase())
      const controller = new CreateChatController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  private registerFetchChatsRoute(): void {
    this.router.get(
      '/',
      this.authMiddleware.verifyAuthentication,
      this.validationMiddleware.validate(
        'query',
        z.object({
          search: searchSchema.default(''),
          page: pageSchema,
          itemsPerPage: itemsPerPageSchema,
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const repository = new SupabaseChatsRepository(http.getSupabase())
        const controller = new FetchChatsController(repository)
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
    this.registerCreateChatRoute()
    this.registerFetchChatsRoute()
    return this.router
  }
}
