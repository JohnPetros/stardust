import { Hono } from 'hono'
import { z } from 'zod'

import { ENV } from '@/constants'
import { SendErrorNotificationController } from '@/rest/controllers/notification'
import { DiscordNotificationService } from '@/rest/services'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { HonoRouter } from '../../HonoRouter'
import { HonoHttp } from '../../HonoHttp'
import { ValidationMiddleware } from '../../middlewares'

export class NotificationRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/notification')
  private readonly validationMiddleware = new ValidationMiddleware()

  private registerSendErrorNotificationRoute(): void {
    this.router.post(
      '/error',
      this.validationMiddleware.validate(
        'json',
        z.object({
          message: z.string(),
        }),
      ),
      async (context) => {
        const http = new HonoHttp(context)
        const restClient = new AxiosRestClient(ENV.discordWebhookUrl)
        const notificationService = new DiscordNotificationService(restClient)
        const controller = new SendErrorNotificationController(notificationService)
        const response = await controller.handle(http)
        return http.sendResponse(response)
      },
    )
  }

  registerRoutes(): Hono {
    this.registerSendErrorNotificationRoute()
    return this.router
  }
}
