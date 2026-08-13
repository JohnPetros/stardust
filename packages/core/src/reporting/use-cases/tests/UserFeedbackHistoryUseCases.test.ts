import { Integer, Text } from '#global/domain/structures/index'
import { FeedbackMessagesFaker } from '../../domain/entities/fakers/FeedbackMessagesFaker'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'
import type {
  FeedbackMessagesRepository,
  FeedbackReportsRepository,
} from '../../interfaces'
import { CountUnreadFeedbackReportsUseCase } from '../CountUnreadFeedbackReportsUseCase'
import { CreateFeedbackReportAttachmentUploadUrlUseCase } from '../CreateFeedbackReportAttachmentUploadUrlUseCase'
import { GetUserFeedbackReportUseCase } from '../GetUserFeedbackReportUseCase'
import { ListUserFeedbackReportsUseCase } from '../ListUserFeedbackReportsUseCase'

const authorId = '11111111-1111-4111-8111-111111111111'
const reportId = '22222222-2222-4222-8222-222222222222'

describe('user feedback history use cases', () => {
  it('lists only the requested author through the repository port and defaults to ten items', async () => {
    const report = FeedbackReportsFaker.fake({ id: reportId, author: { id: authorId } })
    const reports = {
      listByAuthor: jest.fn().mockResolvedValue({ items: [report], total: 1 }),
    } as unknown as FeedbackReportsRepository

    const result = await new ListUserFeedbackReportsUseCase(reports).execute({ authorId })

    expect(reports.listByAuthor).toHaveBeenCalledWith(
      expect.objectContaining({
        authorId: expect.objectContaining({ value: authorId }),
        page: expect.objectContaining({ value: 1 }),
        itemsPerPage: expect.objectContaining({ value: 10 }),
      }),
    )
    expect(result).toEqual({
      items: [report.dto],
      page: 1,
      itemsPerPage: 10,
      total: 1,
    })
  })

  it('returns conversation details with the latest message ids and protects ownership', async () => {
    const report = FeedbackReportsFaker.fake({ id: reportId, author: { id: authorId } })
    const messages = [
      FeedbackMessagesFaker.fake({
        id: '33333333-3333-4333-8333-333333333333',
        reportId,
        authorRole: 'admin',
      }),
      FeedbackMessagesFaker.fake({
        id: '44444444-4444-4444-8444-444444444444',
        reportId,
        authorRole: 'user',
      }),
    ]
    const reports = {
      findByIdAndAuthor: jest.fn().mockResolvedValue(report),
    } as unknown as FeedbackReportsRepository
    const messageRepository = {
      listByReport: jest.fn().mockResolvedValue(messages),
    } as unknown as FeedbackMessagesRepository

    const result = await new GetUserFeedbackReportUseCase(
      reports,
      messageRepository,
    ).execute({
      feedbackReportId: reportId,
      authorId,
    })

    expect(reports.findByIdAndAuthor).toHaveBeenCalledWith(
      expect.objectContaining({ value: reportId }),
      expect.objectContaining({ value: authorId }),
    )
    expect(result.latestAdminMessageId).toBe(messages[0]?.id.value)
    expect(result.latestUserMessageId).toBe(messages[1]?.id.value)
  })

  it('represents an unread count of zero without abusing an ordinal page value', async () => {
    const reports = {
      countUnreadByAuthor: jest.fn().mockResolvedValue(0),
    } as unknown as FeedbackReportsRepository

    const result = await new CountUnreadFeedbackReportsUseCase(reports).execute({
      authorId,
    })

    expect(result).toBeInstanceOf(Integer)
    expect(result.value).toBe(0)
  })

  it('validates contextual initial uploads and never places the actor in the storage path', async () => {
    const createSignedUploadUrl = jest.fn().mockResolvedValue({
      dto: {
        url: 'https://storage.example/upload',
        folderPath: 'images/feedback-reports',
        fileName: '55555555-5555-4555-8555-555555555555.png',
      },
    })
    const storage = { createSignedUploadUrl } as never
    const useCase = new CreateFeedbackReportAttachmentUploadUrlUseCase(storage)

    const result = await useCase.execute({
      actorId: authorId,
      fileName: Text.create('55555555-5555-4555-8555-555555555555.png'),
      mimeType: Text.create('image/png'),
      size: Integer.create(100),
    })

    expect(result.folderPath).toBe('images/feedback-reports')
    expect(createSignedUploadUrl).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'images/feedback-reports' }),
      expect.objectContaining({ value: '55555555-5555-4555-8555-555555555555.png' }),
    )
    expect(JSON.stringify(createSignedUploadUrl.mock.calls[0])).not.toContain(authorId)
  })
})
