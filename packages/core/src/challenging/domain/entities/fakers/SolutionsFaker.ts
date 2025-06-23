import { faker } from '@faker-js/faker'

import { AuthorAggregatesFaker } from '#global/domain/aggregates/fakers/AuthorAggregatesFaker'
import type { SolutionDto } from '../dtos'
import { Solution } from '..'

export class SolutionsFaker {
  static fake(baseDto?: Partial<SolutionDto>): Solution {
    return Solution.create(SolutionsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<SolutionDto>): SolutionDto {
    const fakeAuthor = AuthorAggregatesFaker.fakeDto()
    return {
      id: faker.string.uuid(),
      title: faker.person.firstName(),
      slug: faker.lorem.slug(),
      author: fakeAuthor,
      content: '',
      postedAt: new Date(),
      upvotesCount: 0,
      viewsCount: 0,
      commentsCount: 0,
      ...baseDto,
    }
  }

  static fakeManyDto(count?: number, baseDto?: Partial<SolutionDto>): SolutionDto[] {
    return Array.from({ length: count ?? 10 }).map(() => SolutionsFaker.fake(baseDto).dto)
  }
}
