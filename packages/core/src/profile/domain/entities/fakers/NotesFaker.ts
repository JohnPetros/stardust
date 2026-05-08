import { faker } from '@faker-js/faker'

import type { NoteDto } from '../dtos'
import { Note } from '../Note'

export class NotesFaker {
  static fake(baseDto?: Partial<NoteDto>): Note {
    return Note.create(NotesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<NoteDto>): NoteDto {
    return {
      id: faker.string.uuid(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...baseDto,
    }
  }

  static fakeMany(count?: number, baseDto?: Partial<NoteDto>): Note[] {
    return Array.from({ length: count ?? 10 }).map(() => NotesFaker.fake(baseDto))
  }

  static fakeManyDto(count?: number, baseDto?: Partial<NoteDto>): NoteDto[] {
    return Array.from({ length: count ?? 10 }).map(() => NotesFaker.fakeDto(baseDto))
  }
}
