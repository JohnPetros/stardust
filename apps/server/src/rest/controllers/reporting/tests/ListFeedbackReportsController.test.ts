import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'
import { ListFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'
import { ListFeedbackReportsController } from '../ListFeedbackReportsController'

describe('List Feedback Reports Controller', () => {
  let http: Mock<Http<any>>
  let useCase: Mock<ListFeedbackReportsUseCase>
  let controller: ListFeedbackReportsController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new ListFeedbackReportsController(useCase)
  })

  it('should call the use case with default parameters', async () => {
    const dtos = [FeedbackReportsFaker.fakeDto()]
    const paginationResponse = {
      items: dtos,
      page: 1,
      itemsPerPage: 10,
      total: 1,
      summary: { total: 1, open: 1, closed: 0, unread: 0 },
    }
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue({})
    useCase.execute.mockResolvedValue(paginationResponse)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      page: 1,
      itemsPerPage: 10,
      authorName: undefined,
      intent: undefined,
      sentAtStartDate: undefined,
      sentAtEndDate: undefined,
    })
    expect(http.send).toHaveBeenCalledWith(paginationResponse)
    expect(result).toBe(restResponse)
  })

  it('should call the use case with provided parameters', async () => {
    const params = {
      page: 2,
      itemsPerPage: 20,
      authorName: 'John Doe',
      intent: 'bug' as const,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    }
    const dtos = [FeedbackReportsFaker.fakeDto()]
    const paginationResponse = {
      items: dtos,
      page: 2,
      itemsPerPage: 20,
      total: 1,
      summary: { total: 1, open: 1, closed: 0, unread: 0 },
    }
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(params)
    useCase.execute.mockResolvedValue(paginationResponse)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      search: params.authorName,
      intent: params.intent,
      status: undefined,
      sentAtStartDate: params.startDate,
      sentAtEndDate: params.endDate,
    })
    expect(http.send).toHaveBeenCalledWith(paginationResponse)
    expect(result).toBe(restResponse)
  })
})
