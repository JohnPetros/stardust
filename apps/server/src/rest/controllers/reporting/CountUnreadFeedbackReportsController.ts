import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { CountUnreadFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'

export class CountUnreadFeedbackReportsController implements Controller {
  constructor(private readonly useCase: CountUnreadFeedbackReportsUseCase) {}

  async handle(http: Http): Promise<RestResponse> {
    const count = await this.useCase.execute({ authorId: await http.getAccountId() })
    return http.send({ count: count.value })
  }
}
