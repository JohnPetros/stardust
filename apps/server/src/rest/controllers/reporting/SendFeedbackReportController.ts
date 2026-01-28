import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { SendFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import type { FeedbackReportDto } from '@stardust/core/reporting/entities/dtos'

import type { AvatarAggregateDto } from '@stardust/core/profile/aggregates/dtos'

type Schema = {
  body: Omit<FeedbackReportDto, 'author' | 'id'> & {
    userName?: string
    userSlug?: string
    userAvatar?: AvatarAggregateDto
  }
}

export class SendFeedbackReportController implements Controller<Schema> {
  constructor(private readonly useCase: SendFeedbackReportUseCase) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { content, intent, screenshot, userName, userSlug, userAvatar } =
      await http.getBody()
    const accountId = await http.getAccountId()

    console.log(userName, userSlug, userAvatar)

    const response = await this.useCase.execute({
      content,
      intent,
      screenshot,
      author: {
        id: accountId,
        entity: {
          name: userName ?? '',
          slug: userSlug ?? '',
          avatar: {
            image: userAvatar?.entity?.image ?? '',
            name: userAvatar?.entity?.name ?? '',
          },
        },
      },
    })

    return http.send(response)
  }
}
