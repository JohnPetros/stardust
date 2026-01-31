import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { DeleteFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import { DeleteFeedbackReportController } from '../DeleteFeedbackReportController'

describe('Delete Feedback Report Controller', () => {
  let http: Mock<Http<any>>
  let useCase: Mock<DeleteFeedbackReportUseCase>
  let controller: DeleteFeedbackReportController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new DeleteFeedbackReportController(useCase)
  })

  it('should call the use case with correct feedbackId from route params', async () => {
    const feedbackId = 'feedback-123'
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ feedbackId })
    useCase.execute.mockResolvedValue(undefined)
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalled()
    expect(useCase.execute).toHaveBeenCalledWith({ feedbackId })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalled()
    expect(result).toBe(restResponse)
  })
})
