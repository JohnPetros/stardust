import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import type { CountUnreadFeedbackReportsRequest } from '../domain/types'
import type { FeedbackReportsRepository } from '../interfaces'

export class CountUnreadFeedbackReportsUseCase
  implements UseCase<CountUnreadFeedbackReportsRequest, Promise<Integer>>
{
  constructor(private readonly reports: FeedbackReportsRepository) {}

  async execute(request: CountUnreadFeedbackReportsRequest): Promise<Integer> {
    return Integer.create(
      await this.reports.countUnreadByAuthor(Id.create(request.authorId)),
    )
  }
}
