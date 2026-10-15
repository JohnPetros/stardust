import type { Database } from '#global/interfaces/Database'
import { mock, type Mock } from 'ts-jest-mocker'
import { SendFeedbackReportUseCase } from '../SendFeedbackReportUseCase'
import type { FeedbackReportsRepository } from '../../interfaces/FeedbackReportsRepository'
import type { Broker } from '#global/interfaces/Broker'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'
import { FeedbackReportSentEvent } from '../../domain/events'

describe('SendFeedbackReportUseCase', () => {
  let database: Mock<Database>
  let repository: Mock<FeedbackReportsRepository>
  let broker: Mock<Broker>
  let useCase: SendFeedbackReportUseCase

  beforeEach(() => {
    database = mock<Database>()
    database.run.mockImplementation(async (operation) => operation())
    repository = mock<FeedbackReportsRepository>()
    broker = mock<Broker>()

    repository.add.mockResolvedValue(undefined)
    broker.publish.mockResolvedValue(undefined)

    useCase = new SendFeedbackReportUseCase(database, repository, broker)
  })

  it('should send a feedback report successfully', async () => {
    const dto = FeedbackReportsFaker.fakeDto()

    const result = await useCase.execute(dto)

    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledTimes(1)
    expect(broker.publish).toHaveBeenCalledWith(expect.any(FeedbackReportSentEvent))
    expect(result.content).toBe(dto.content)
    expect(result.intent).toBe(dto.intent)
    expect(result.author.id).toBe(dto.author.id)
  })

  it('should call repository with the created report', async () => {
    const dto = FeedbackReportsFaker.fakeDto()

    await useCase.execute(dto)

    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({ value: dto.content }),
        intent: expect.objectContaining({ value: dto.intent }),
      }),
    )
  })

  it('should throw if repository fails', async () => {
    const dto = FeedbackReportsFaker.fakeDto()
    repository.add.mockRejectedValue(new Error('Repo error'))

    await expect(useCase.execute(dto)).rejects.toThrow('Repo error')
  })

  it('recreates the report and event on each transaction callback invocation', async () => {
    const dto = FeedbackReportsFaker.fakeDto()
    database.run.mockImplementationOnce(async (operation) => {
      await operation()
      return operation()
    })

    const result = await useCase.execute(dto)

    expect(repository.add).toHaveBeenCalledTimes(2)
    const firstReport = repository.add.mock.calls[0][0]
    const secondReport = repository.add.mock.calls[1][0]
    expect(firstReport).not.toBe(secondReport)
    expect(broker.publish.mock.calls[0][0]).not.toBe(broker.publish.mock.calls[1][0])
    expect(result).toEqual(secondReport.dto)
  })
})
