import { faker } from '@faker-js/faker'

import { OpenQuestion } from '../OpenQuestion'
import type { OpenQuestionDto } from '../dtos'

export class OpenQuestionsFaker {
  static fake(baseDto?: Partial<OpenQuestionDto>): OpenQuestion {
    return OpenQuestion.create(OpenQuestionsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<OpenQuestionDto>): OpenQuestionDto {
    const lines = baseDto?.lines ?? [
      {
        number: 1,
        texts: ['input-1'],
        indentation: 0,
      },
    ]

    return {
      id: baseDto?.id ?? faker.string.uuid(),
      type: 'open',
      stem: baseDto?.stem ?? faker.lorem.sentence(),
      picture: baseDto?.picture ?? `${faker.image.avatar()}.jpg`,
      answers: baseDto?.answers ?? ['answer'],
      code: baseDto?.code ?? undefined,
      lines,
    }
  }
}
