import { faker } from '@faker-js/faker'

import { Comment } from '../Comment'
import type { CommentDto } from '../dtos'
import { AuthorAggregatesFaker } from '#global/domain/aggregates/fakers/AuthorAggregatesFaker'

export class CommentsFaker {
  static fake(baseDto?: Partial<CommentDto>): Comment {
    return Comment.create(CommentsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<CommentDto>): CommentDto {
    return {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      upvotesCount: 0,
      repliesCount: 0,
      postedAt: faker.date.recent(),
      author: AuthorAggregatesFaker.fakeDto(),
      ...baseDto,
    }
  }
}
