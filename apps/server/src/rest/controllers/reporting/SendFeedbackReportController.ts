import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { SendFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import type { AvatarAggregateDto } from '@stardust/core/profile/aggregates/dtos'

type Schema = {
  body: {
    content: string
    intent: 'bug' | 'idea' | 'other'
    initialAttachment?: {
      storageKey: string
      originalName: string
      mimeType: 'image/png' | 'image/jpeg'
      size: number
    }
    userName?: string
    userSlug?: string
    userAvatar?: AvatarAggregateDto
  }
}

export class FeedbackReport implements Controller<Schema> {
  constructor(private readonly useCase: SendFeedbackReportUseCase) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { content, intent, initialAttachment, userName, userSlug, userAvatar } =
      await http.getBody()
    const accountId = await http.getAccountId()

    const response = await this.useCase.execute({
      content,
      intent,
      initialAttachment,
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

    return http.statusCreated().send(response)
  }
}
