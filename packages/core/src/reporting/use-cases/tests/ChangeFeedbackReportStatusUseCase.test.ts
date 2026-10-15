import { mock, type Mock } from 'ts-jest-mocker'
import type { Database } from '#global/interfaces/Database'
import { ChangeFeedbackReportStatusUseCase } from '../ChangeFeedbackReportStatusUseCase'
import type { FeedbackReportsRepository } from '../../interfaces'
import type { Broker } from '#global/interfaces/Broker'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'

describe('ChangeFeedbackReportStatusUseCase', () => {
  let database: Mock<Database>
  let reports: FeedbackReportsRepository
  let findById: jest.Mock
  let changeStatus: jest.Mock
  let broker: { publish: jest.Mock }

  beforeEach(() => {
    database = mock<Database>()
    database.run.mockImplementation(async (operation) => operation())
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
      database,
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
  it('checks the canonical status before parsing an invalid target status', async () => {
    const report = FeedbackReportsFaker.fake({ status: 'closed' })
    findById.mockResolvedValue(report)
    const useCase = new ChangeFeedbackReportStatusUseCase(
      database,
      reports,
      broker as Broker,
    )

    await expect(
      useCase.execute({
        feedbackReportId: report.id.value,
        expectedStatus: 'open',
        status: 'invalid',
      }),
    ).rejects.toThrow('Estado canônico: closed')

    expect(changeStatus).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('validates the expected status before the target status', async () => {
    const report = FeedbackReportsFaker.fake({ status: 'open' })
    findById.mockResolvedValue(report)
    const useCase = new ChangeFeedbackReportStatusUseCase(
      database,
      reports,
      broker as Broker,
    )

    await expect(
      useCase.execute({
        feedbackReportId: report.id.value,
        expectedStatus: 'invalid-expected',
        status: 'invalid-target',
      }),
    ).rejects.toThrow('Status do relatório de feedback inválido: invalid-expected')

    expect(changeStatus).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
