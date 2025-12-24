import { faker } from '@faker-js/faker'

import type { GuideDto } from '../dtos'
import { Guide } from '..'

export class GuidesFaker {
  static fake(baseDto?: Partial<GuideDto>): Guide {
    return Guide.create({
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(3),
      position: faker.number.int({ min: 1, max: 100 }),
      category: 'lsp',
      ...baseDto,
    })
  }

  static fakeMany(count?: number): Guide[] {
    return Array.from({ length: count ?? 10 }).map(() => GuidesFaker.fake())
  }

  static fakeDto(baseDto?: Partial<GuideDto>): GuideDto {
    return GuidesFaker.fake(baseDto).dto
  }

  static fakeManyDto(count?: number, baseDto?: Partial<GuideDto>): GuideDto[] {
    return Array.from({ length: count ?? 10 }).map(() => GuidesFaker.fakeDto(baseDto))
  }
}
