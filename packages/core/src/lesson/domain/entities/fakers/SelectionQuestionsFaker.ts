import { faker } from '@faker-js/faker'

import { SelectionQuestion } from '../SelectionQuestion'
import type { SelectionQuestionDto } from '../dtos'

export class SelectionQuestionsFaker {
  static fake(baseDto?: Partial<SelectionQuestionDto>): SelectionQuestion {
    return SelectionQuestion.create(SelectionQuestionsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<SelectionQuestionDto>): SelectionQuestionDto {
    const answer = baseDto?.answer ?? faker.lorem.word()
    const optionsBase = baseDto?.options ?? [
      faker.lorem.word(),
      faker.lorem.word(),
      faker.lorem.word(),
    ]
    const options = [...optionsBase]

    if (!options.includes(answer)) {
      options.push(answer)
    }

    return {
      id: baseDto?.id ?? faker.string.uuid(),
      type: 'selection',
      stem: baseDto?.stem ?? faker.lorem.sentence(),
      picture: baseDto?.picture ?? `${faker.image.avatar()}.jpg`,
      options,
      answer,
      code: baseDto?.code ?? undefined,
    }
  }
}
