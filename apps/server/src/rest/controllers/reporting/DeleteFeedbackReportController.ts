import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { DeleteFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'

type Schema = {
  routeParams: {
    feedbackId: string
  }
}

export class DeleteFeedbackReportController implements Controller<Schema> {
  constructor(private readonly useCase: DeleteFeedbackReportUseCase) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { feedbackId } = http.getRouteParams()

    await this.useCase.execute({ feedbackId })

    return http.statusNoContent().send()
  }
}
