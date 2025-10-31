import { faker } from '@faker-js/faker'

import { DragAndDropListQuestion } from '../DragAndDropListQuestion'
import type { DragAndDropListQuestionDto } from '../dtos'

export class DragAndDropListQuestionsFaker {
  static fake(baseDto?: Partial<DragAndDropListQuestionDto>): DragAndDropListQuestion {
    return DragAndDropListQuestion.create(DragAndDropListQuestionsFaker.fakeDto(baseDto))
  }

  static fakeDto(
    baseDto?: Partial<DragAndDropListQuestionDto>,
  ): DragAndDropListQuestionDto {
    const items =
      baseDto?.items ??
      Array.from({ length: 3 }, (_, index) => ({
        position: index + 1,
        label: faker.lorem.word(),
      }))

    return {
      id: baseDto?.id ?? faker.string.uuid(),
      type: 'drag-and-drop-list',
      stem: baseDto?.stem ?? faker.lorem.sentence(),
      picture: baseDto?.picture ?? `${faker.image.avatar()}.jpg`,
      items,
    }
  }
}
