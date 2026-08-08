import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { Integer } from '@stardust/core/global/structures'
import { RestResponse } from '@stardust/core/global/responses'
import {
  CountUnreadFeedbackReportsUseCase,
  CreateFeedbackReportAttachmentUploadUrlUseCase,
  GetUserFeedbackReportUseCase,
  ListUserFeedbackReportsUseCase,
  MarkFeedbackReportAsReadUseCase,
} from '@stardust/core/reporting/use-cases'

import { CountUnreadFeedbackReportsController } from '../CountUnreadFeedbackReportsController'
import { CreateFeedbackReportAttachmentUploadUrlController } from '../CreateFeedbackReportAttachmentUploadUrlController'
import { GetUserFeedbackReportController } from '../GetUserFeedbackReportController'
import { ListUserFeedbackReportsController } from '../ListUserFeedbackReportsController'
import { MarkUserFeedbackReportAsReadController } from '../MarkUserFeedbackReportAsReadController'

const accountId = '11111111-1111-4111-8111-111111111111'
const reportId = '22222222-2222-4222-8222-222222222222'
const messageId = '33333333-3333-4333-8333-333333333333'

describe('User feedback reporting controllers', () => {
  let http: Mock<Http<any>>

  beforeEach(() => {
    http = mock()
    http.getAccountId.mockResolvedValue(accountId)
    http.statusCreated.mockReturnValue(http)
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(mock<RestResponse>())
  })

  it('lists only the session author with the supported query fields', async () => {
    const useCase = mock<ListUserFeedbackReportsUseCase>()
    const controller = new ListUserFeedbackReportsController(useCase)
    const page = { items: [], page: 2, itemsPerPage: 10, total: 0 }
    const response = mock<RestResponse>()

    http.getQueryParams.mockReturnValue({ status: 'open', page: 2, itemsPerPage: 10 })
    useCase.execute.mockResolvedValue(page)
    http.send.mockReturnValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)

    expect(useCase.execute).toHaveBeenCalledWith({
      authorId: accountId,
      status: 'open',
      page: 2,
      itemsPerPage: 10,
    })
  })

  it('returns the unread count for the authenticated author', async () => {
    const useCase = mock<CountUnreadFeedbackReportsUseCase>()
    const controller = new CountUnreadFeedbackReportsController(useCase)
    const response = mock<RestResponse>()

    useCase.execute.mockResolvedValue(Integer.create(2))
    http.send.mockReturnValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)

    expect(useCase.execute).toHaveBeenCalledWith({ authorId: accountId })
    expect(http.send).toHaveBeenCalledWith({ count: 2 })
  })

  it('passes session ownership to the detail use case', async () => {
    const useCase = mock<GetUserFeedbackReportUseCase>()
    const controller = new GetUserFeedbackReportController(useCase)
    const detail = { id: reportId }
    const response = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ feedbackReportId: reportId })
    useCase.execute.mockResolvedValue(detail as never)
    http.send.mockReturnValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)

    expect(useCase.execute).toHaveBeenCalledWith({
      feedbackReportId: reportId,
      authorId: accountId,
    })
  })

  it('marks the observed administrative message as read as the session user', async () => {
    const useCase = mock<MarkFeedbackReportAsReadUseCase>()
    const controller = new MarkUserFeedbackReportAsReadController(useCase)

    http.getRouteParams.mockReturnValue({ feedbackReportId: reportId })
    http.getBody.mockResolvedValue({ lastSeenMessageId: messageId })
    useCase.execute.mockResolvedValue(undefined)

    await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      feedbackReportId: reportId,
      actor: { accountId, role: 'user' },
      lastSeenMessageId: messageId,
    })
    expect(http.statusNoContent).toHaveBeenCalled()
  })

  it('creates the initial upload URL with the authenticated actor only', async () => {
    const useCase = mock<CreateFeedbackReportAttachmentUploadUrlUseCase>()
    const controller = new CreateFeedbackReportAttachmentUploadUrlController(useCase)
    const signedUpload = {
      url: 'https://storage.test/upload',
      path: 'images/feedback-reports/file.png',
    }
    const response = mock<RestResponse>()

    http.getBody.mockResolvedValue({
      fileName: '44444444-4444-4444-8444-444444444444.png',
      mimeType: 'image/png',
      size: 256,
      userId: 'untrusted-user',
    })
    useCase.execute.mockResolvedValue(signedUpload as never)
    http.send.mockReturnValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)

    expect(useCase.execute).toHaveBeenCalledWith({
      actorId: accountId,
      fileName: expect.objectContaining({
        value: '44444444-4444-4444-8444-444444444444.png',
      }),
      mimeType: expect.objectContaining({ value: 'image/png' }),
      size: expect.objectContaining({ value: 256 }),
    })
    expect(http.statusCreated).toHaveBeenCalled()
  })
})
