import { faker } from '@faker-js/faker'
import { AuthorAggregatesFaker } from '#global/domain/aggregates/fakers/AuthorAggregatesFaker'
import type { FeedbackReportDto } from '../dtos'
import { FeedbackReport } from '../FeedbackReport'

export class FeedbackReportsFaker {
  static fake(baseDto?: Partial<FeedbackReportDto>): FeedbackReport {
    return FeedbackReport.create(FeedbackReportsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<FeedbackReportDto>): FeedbackReportDto {
    return {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      intent: faker.helpers.arrayElement(['bug', 'idea', 'other']),
      author: AuthorAggregatesFaker.fakeDto(),
      sentAt: faker.date.recent().toISOString(),
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: Partial<FeedbackReportDto>): FeedbackReport[] {
    return Array.from({ length: count }, () => FeedbackReportsFaker.fake(baseDto))
  }
}
