import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

type Schema = {
  body: {
    message: string
  }
}

export class SendErrorNotificationController implements Controller<Schema> {
  constructor(private readonly service: NotificationService) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { message } = await http.getBody()
    return await this.service.sendErrorNotification('web', message)
  }
}
