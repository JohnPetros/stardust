import { mock, type Mock } from 'ts-jest-mocker'
import { FeedbackMessagesFaker } from '../../domain/entities/fakers/FeedbackMessagesFaker'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'
import type {
  FeedbackMessagesRepository,
  FeedbackReportsRepository,
} from '../../interfaces'
import { MarkFeedbackReportAsReadUseCase } from '../MarkFeedbackReportAsReadUseCase'

describe('MarkFeedbackReportAsReadUseCase', () => {
  let reports: Mock<FeedbackReportsRepository>
  let messages: Mock<FeedbackMessagesRepository>

  beforeEach(() => {
    reports = mock<FeedbackReportsRepository>()
    messages = mock<FeedbackMessagesRepository>()
  })

  it('marks the exact user-message snapshot through the atomic repository port', async () => {
    const report = FeedbackReportsFaker.fake({
      id: '00000000-0000-4000-8000-000000000001',
    })
    const message = FeedbackMessagesFaker.fake({
      id: '00000000-0000-4000-8000-000000000002',
      reportId: report.id.value,
      authorRole: 'user',
      createdAt: '2026-08-04T10:00:00.000Z',
    })
    reports.findById.mockResolvedValue(report)
    messages.findById.mockResolvedValue(message)
    reports.markAsRead.mockResolvedValue(undefined)

    await new MarkFeedbackReportAsReadUseCase(reports, messages).execute({
      feedbackReportId: report.id.value,
      lastSeenUserMessageId: message.id.value,
    })

    expect(reports.markAsRead).toHaveBeenCalledWith(
      report.id,
      new Date('2026-08-04T10:00:00.000Z'),
    )
    expect(reports.save).not.toHaveBeenCalled()
  })
})
