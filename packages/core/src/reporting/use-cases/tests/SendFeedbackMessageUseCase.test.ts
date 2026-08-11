import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'
import { FeedbackMessage } from '../../domain/entities/FeedbackMessage'
import { SendFeedbackMessageUseCase } from '../SendFeedbackMessageUseCase'
import type { FeedbackReportsRepository } from '../../interfaces/FeedbackReportsRepository'
import type { FeedbackMessagesRepository } from '../../interfaces/FeedbackMessagesRepository'
import type { Broker } from '#global/interfaces/Broker'

describe('SendFeedbackMessageUseCase fixes', () => {
  const userId = '11111111-1111-4111-8111-111111111111'
  const report = FeedbackReportsFaker.fake({
    author: { id: userId },
    adminMessageCount: 1,
  })

  it('persists a message with its attachment metadata', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue(report),
      findAuthorEmail: jest.fn().mockResolvedValue({ value: 'user@example.com' }),
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as FeedbackReportsRepository
    const add = jest.fn().mockImplementation((message) => message)
    const addAttachments = jest.fn().mockResolvedValue(undefined)
    const messages = {
      findById: jest.fn().mockResolvedValue(null),
      add,
      addAttachments,
    } as unknown as FeedbackMessagesRepository
    const publish = jest.fn()
    const broker = { publish } as unknown as Broker
    const useCase = new SendFeedbackMessageUseCase(repository, messages, broker)
    const reportId = report.id.value
    const messageId = crypto.randomUUID()
    const fileId = crypto.randomUUID()

    await useCase.execute({
      feedbackReportId: reportId,
      actor: { accountId: userId, role: 'admin' },
      messageId,
      content: 'Resposta',
      attachments: [
        {
          id: crypto.randomUUID(),
          storageKey: `images/feedback-messages/${reportId}/${messageId}/${fileId}.png`,
          originalName: 'evidence from user.png',
          mimeType: 'image/png',
          size: 10,
        },
      ],
    })

    expect(add.mock.invocationCallOrder[0]).toBeLessThan(
      publish.mock.invocationCallOrder[0],
    )
    expect(addAttachments).toHaveBeenCalled()
  })

  it('does not let a regular user request a status change', async () => {
    const repository = {
      findById: jest.fn().mockResolvedValue(report),
      save: jest.fn(),
    } as unknown as FeedbackReportsRepository
    const messages = {
      findById: jest.fn(),
      add: jest.fn(),
      addAttachments: jest.fn(),
    } as unknown as FeedbackMessagesRepository
    const broker = { publish: jest.fn() } as unknown as Broker
    const useCase = new SendFeedbackMessageUseCase(repository, messages, broker)

    await expect(
      useCase.execute({
        feedbackReportId: report.id.value,
        actor: { accountId: userId, role: 'user' },
        messageId: crypto.randomUUID(),
        content: 'Resposta do usuário',
        attachments: [],
        targetStatus: 'closed',
      }),
    ).rejects.toThrow('Somente administradores')
    expect(messages.add).not.toHaveBeenCalled()
  })

  it('reconciles duplicate messages and republishes the remaining side effects', async () => {
    const duplicateReport = FeedbackReportsFaker.fake({
      author: { id: userId },
      adminMessageCount: 0,
    })
    const messageId = crypto.randomUUID()
    const existing = FeedbackMessage.create({
      id: messageId,
      reportId: duplicateReport.id.value,
      authorRole: 'admin',
      authorId: userId,
      content: 'Resposta duplicada',
      attachments: [],
    })
    const repository = {
      findById: jest.fn().mockResolvedValue(duplicateReport),
      findAuthorEmail: jest.fn().mockResolvedValue({ value: 'user@example.com' }),
      save: jest.fn().mockResolvedValue(undefined),
    } as unknown as FeedbackReportsRepository
    const messages = {
      findById: jest.fn().mockResolvedValue(existing),
      add: jest.fn(),
      addAttachments: jest.fn().mockResolvedValue(undefined),
    } as unknown as FeedbackMessagesRepository
    const broker = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as unknown as Broker

    const response = await new SendFeedbackMessageUseCase(
      repository,
      messages,
      broker,
    ).execute({
      feedbackReportId: duplicateReport.id.value,
      actor: { accountId: userId, role: 'admin' },
      messageId,
      content: 'Resposta duplicada',
      attachments: [],
    })

    expect(response.isDuplicate.isTrue).toBe(true)
    expect(messages.add).not.toHaveBeenCalled()
    expect(messages.addAttachments).toHaveBeenCalledWith(existing)
    expect(repository.save).toHaveBeenCalled()
    expect(broker.publish).toHaveBeenCalled()
  })
})
