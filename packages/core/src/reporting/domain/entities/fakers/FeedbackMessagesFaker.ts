import { faker } from '@faker-js/faker'
import type { FeedbackMessageDto } from '../dtos/FeedbackMessageDto'
import { FeedbackMessage } from '../FeedbackMessage'

export class FeedbackMessagesFaker {
  static fake(baseDto?: Partial<FeedbackMessageDto>): FeedbackMessage {
    return FeedbackMessage.create(FeedbackMessagesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<FeedbackMessageDto>): FeedbackMessageDto {
    return {
      id: faker.string.uuid(),
      reportId: faker.string.uuid(),
      authorRole: faker.helpers.arrayElement(['user', 'admin']),
      authorId: faker.string.uuid(),
      content: faker.lorem.sentence(),
      createdAt: faker.date.recent().toISOString(),
      attachments: [],
      ...baseDto,
    }
  }

  static fakeMany(count = 10, baseDto?: Partial<FeedbackMessageDto>) {
    return Array.from({ length: count }, () => FeedbackMessagesFaker.fake(baseDto))
  }
}
