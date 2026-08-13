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

  it('uses the authenticated author and the observed administrative message id', async () => {
    const report = FeedbackReportsFaker.fake({
      id: '00000000-0000-4000-8000-000000000001',
      author: { id: '11111111-1111-4111-8111-111111111111' },
      lastAdminMessageAt: '2026-08-04T10:00:00.000Z',
    })
    const message = FeedbackMessagesFaker.fake({
      id: '00000000-0000-4000-8000-000000000002',
      reportId: report.id.value,
      authorRole: 'admin',
      createdAt: '2026-08-04T10:00:00.000Z',
    })
    reports.findByIdAndAuthor.mockResolvedValue(report)
    messages.findById.mockResolvedValue(message)
    reports.markAsRead.mockResolvedValue(undefined)

    await new MarkFeedbackReportAsReadUseCase(reports, messages).execute({
      feedbackReportId: report.id.value,
      actor: { accountId: report.author.id.value, role: 'user' },
      lastSeenMessageId: message.id.value,
    })

    expect(reports.findByIdAndAuthor).toHaveBeenCalledWith(report.id, report.author.id)
    expect(reports.markAsRead).toHaveBeenCalledWith({
      feedbackReportId: report.id,
      authorId: report.author.id,
      participant: 'author',
      lastSeenMessageAt: message.createdAt,
    })
  })

  it('does not reveal a report when the authenticated author does not own it', async () => {
    reports.findByIdAndAuthor.mockResolvedValue(null)

    await expect(
      new MarkFeedbackReportAsReadUseCase(reports, messages).execute({
        feedbackReportId: '00000000-0000-4000-8000-000000000001',
        actor: {
          accountId: '11111111-1111-4111-8111-111111111111',
          role: 'user',
        },
        lastSeenMessageId: '00000000-0000-4000-8000-000000000002',
      }),
    ).rejects.toThrow('Relatório de feedback não encontrado')
    expect(messages.findById).not.toHaveBeenCalled()
  })
})
