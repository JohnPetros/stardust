import { ChangeFeedbackReportStatusUseCase } from '../ChangeFeedbackReportStatusUseCase'
import type { FeedbackReportsRepository } from '../../interfaces'
import type { Broker } from '#global/interfaces/Broker'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'

describe('ChangeFeedbackReportStatusUseCase', () => {
  let reports: FeedbackReportsRepository
  let findById: jest.Mock
  let changeStatus: jest.Mock
  let broker: { publish: jest.Mock }

  beforeEach(() => {
    findById = jest.fn()
    changeStatus = jest.fn()
    reports = {
      findById,
      changeStatus,
    } as unknown as FeedbackReportsRepository
    broker = { publish: jest.fn() }
  })

  it('persists the status transition and publishes an event after saving', async () => {
    const report = FeedbackReportsFaker.fake({
      status: 'open',
      adminMessageCount: 1,
    })
    findById.mockResolvedValue(report)
    changeStatus.mockResolvedValue(report)

    await new ChangeFeedbackReportStatusUseCase(
      reports,
      broker as unknown as Broker,
    ).execute({
      feedbackReportId: report.id.value,
      status: 'closed',
      expectedStatus: 'open',
    })

    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(changeStatus.mock.invocationCallOrder[0]).toBeLessThan(
      broker.publish.mock.invocationCallOrder[0],
    )
  })
})
