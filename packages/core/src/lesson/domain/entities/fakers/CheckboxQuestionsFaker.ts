import { faker } from '@faker-js/faker'

import { CheckboxQuestion } from '../CheckboxQuestion'
import type { CheckboxQuestionDto } from '../dtos'

export class CheckboxQuestionsFaker {
  static fake(baseDto?: Partial<CheckboxQuestionDto>): CheckboxQuestion {
    return CheckboxQuestion.create(CheckboxQuestionsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<CheckboxQuestionDto>): CheckboxQuestionDto {
    const options =
      baseDto?.options ?? Array.from({ length: 3 }, () => faker.lorem.word())

    const correctOptions = (() => {
      if (baseDto?.correctOptions) {
        const validOptions = baseDto.correctOptions.filter((option) =>
          options.includes(option),
        )
        if (validOptions.length > 0) return validOptions
      }
      return [options[0]]
    })()

    return {
      id: baseDto?.id ?? faker.string.uuid(),
      type: 'checkbox',
      stem: baseDto?.stem ?? faker.lorem.sentence(),
      picture: baseDto?.picture ?? `${faker.image.avatar()}.jpg`,
      options,
      correctOptions,
      code: baseDto?.code ?? undefined,
    }
  }
}
