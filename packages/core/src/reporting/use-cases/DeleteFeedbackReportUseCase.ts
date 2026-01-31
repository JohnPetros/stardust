import type { UseCase } from '#global/interfaces/UseCase'
import type { FeedbackReportsRepository } from '../interfaces'
import type { FeedbackReport } from '../domain/entities/FeedbackReport'
import { FeedbackReportNotFoundError } from '../domain/errors/FeedbackReportNotFoundError'
import { Id } from '#global/domain/structures/Id'

type Request = {
  feedbackId: string
}

type Response = Promise<void>

export class DeleteFeedbackReportUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: FeedbackReportsRepository) {}

  async execute(request: Request): Response {
    const feedback = await this.findById(request.feedbackId)
    await this.repository.remove(feedback.id)
  }

  async findById(feedbackId: string): Promise<FeedbackReport> {
    const feedback = await this.repository.findById(Id.create(feedbackId))
    if (!feedback) {
      throw new FeedbackReportNotFoundError()
    }
    return feedback
  }
}
