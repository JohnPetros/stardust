import { mock, type Mock } from 'ts-jest-mocker'
import { DeleteFeedbackReportUseCase } from '../DeleteFeedbackReportUseCase'
import type { FeedbackReportsRepository } from '../../interfaces/FeedbackReportsRepository'
import { FeedbackReportsFaker } from '../../domain/entities/fakers/FeedbackReportsFaker'
import { FeedbackReportNotFoundError } from '../../domain/errors/FeedbackReportNotFoundError'
import { Id } from '#global/domain/structures/Id'

describe('DeleteFeedbackReportUseCase', () => {
  let repository: Mock<FeedbackReportsRepository>
  let useCase: DeleteFeedbackReportUseCase

  beforeEach(() => {
    repository = mock<FeedbackReportsRepository>()
    useCase = new DeleteFeedbackReportUseCase(repository)
  })

  it('should delete a feedback report successfully', async () => {
    const fakeReport = FeedbackReportsFaker.fake()
    repository.findById.mockResolvedValue(fakeReport)
    repository.remove.mockResolvedValue(undefined)

    await useCase.execute({ feedbackId: fakeReport.id.value })

    expect(repository.findById).toHaveBeenCalledTimes(1)
    expect(repository.findById).toHaveBeenCalledWith(expect.any(Id))
    expect(repository.remove).toHaveBeenCalledTimes(1)
    expect(repository.remove).toHaveBeenCalledWith(fakeReport.id)
  })

  it('should throw FeedbackReportNotFoundError if report does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    const promise = useCase.execute({
      feedbackId: '00000000-0000-0000-0000-000000000000',
    })

    await expect(promise).rejects.toThrow(FeedbackReportNotFoundError)
    expect(repository.remove).not.toHaveBeenCalled()
  })
})
