import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { SendFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'
import { SendFeedbackReportController } from '../SendFeedbackReportController'

describe('Send Feedback Report Controller', () => {
  let http: Mock<Http<any>>
  let useCase: Mock<SendFeedbackReportUseCase>
  let controller: SendFeedbackReportController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new SendFeedbackReportController(useCase)
  })

  it('should call the use case with correct parameters when all fields are provided', async () => {
    const accountId = 'user-123'
    const feedbackDto = FeedbackReportsFaker.fakeDto()
    const body = {
      content: 'Great app!',
      intent: 'idea' as const,
      screenshot: 'http://example.com/screenshot.png',
      userName: 'John Doe',
      userSlug: 'john-doe',
      userAvatar: {
        id: 'avatar-123',
        entity: {
          image: 'http://example.com/avatar.png',
          name: 'Avatar Name',
        },
      },
    }

    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(accountId)
    useCase.execute.mockResolvedValue(feedbackDto)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      content: body.content,
      intent: body.intent,
      screenshot: body.screenshot,
      author: {
        id: accountId,
        entity: {
          name: body.userName,
          slug: body.userSlug,
          avatar: {
            image: body.userAvatar.entity.image,
            name: body.userAvatar.entity.name,
          },
        },
      },
    })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(feedbackDto)
    expect(result).toBe(restResponse)
  })

  it('should call the use case with default values when optional fields are missing', async () => {
    const accountId = 'user-123'
    const feedbackDto = FeedbackReportsFaker.fakeDto()
    const body = {
      content: 'Bug found',
      intent: 'bug' as const,
      // Missing userName, userSlug, userAvatar
    }

    const restResponse = mock<RestResponse>()

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(accountId)
    useCase.execute.mockResolvedValue(feedbackDto)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      content: body.content,
      intent: body.intent,
      screenshot: undefined,
      author: {
        id: accountId,
        entity: {
          name: '',
          slug: '',
          avatar: {
            image: '',
            name: '',
          },
        },
      },
    })
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(feedbackDto)
    expect(result).toBe(restResponse)
  })
})
